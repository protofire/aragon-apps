pragma solidity 0.4.24;

import "@aragon/apps-finance/contracts/Finance.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";
import "@aragon/apps-vault/contracts/Vault.sol";
import "@aragon/os/contracts/acl/ACL.sol";
import "@aragon/os/contracts/apm/APMNamehash.sol";
import "@aragon/os/contracts/apm/Repo.sol";
import "@aragon/os/contracts/evmscript/IEVMScriptRegistry.sol";
import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/kernel/Kernel.sol";
import "@aragon/os/contracts/lib/ens/ENS.sol";
import "@aragon/os/contracts/lib/ens/PublicResolver.sol";
import "@aragon/ppf-contracts/contracts/IFeed.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";

import "./Payroll.sol";


contract PPFMock is IFeed {
  function get(address base, address quote) external view returns (uint128 xrt, uint64 when) {
      xrt = 1;
      when = uint64(now);
  }
}

contract KitBase is APMNamehash, EVMScriptRegistryConstants {
    ENS public ens;
    DAOFactory public fac;

    event DeployInstance(address dao);
    event InstalledApp(address appProxy, bytes32 appId);

    constructor(DAOFactory _fac, ENS _ens) {
        ens = _ens;

        // If no factory is passed, get it from on-chain bare-kit
        if (address(_fac) == address(0)) {
            bytes32 bareKit = apmNamehash("bare-kit");
            fac = KitBase(latestVersionAppBase(bareKit)).fac();
        } else {
            fac = _fac;
        }
    }

    function latestVersionAppBase(bytes32 appId) public view returns (address base) {
        Repo repo = Repo(PublicResolver(ens.resolver(appId)).addr(appId));
        (,base,) = repo.getLatest();

        return base;
    }

    function cleanupDAOPermissions(Kernel dao, ACL acl, address root) internal {
        // Kernel permission clean up
        cleanupPermission(acl, root, dao, dao.APP_MANAGER_ROLE());

        // ACL permission clean up
        cleanupPermission(acl, root, acl, acl.CREATE_PERMISSIONS_ROLE());
    }

    function cleanupPermission(ACL acl, address root, address app, bytes32 permission) internal {
        acl.grantPermission(root, app, permission);
        acl.revokePermission(this, app, permission);
        acl.setPermissionManager(root, app, permission);
    }
}

contract PayrollKit is KitBase {
    MiniMeTokenFactory tokenFactory;

    uint64 financePeriodDuration = 31557600;
    uint64 rateExpiryTime = 1000;
    uint64 amount = uint64(-1);
    address constant ANY_ENTITY = address(-1);

    constructor(ENS ens) KitBase(DAOFactory(0), ens) public {
        tokenFactory = new MiniMeTokenFactory();
    }

    function newInstance()
      public
      returns (Kernel dao, Payroll payroll)
    {
      address root = msg.sender;
      address employer = msg.sender;

      dao = fac.newDAO(this);
      ACL acl = ACL(dao.acl());

      PPFMock priceFeed = new PPFMock();

      MiniMeToken denominationToken = tokenFactory.createCloneToken(MiniMeToken(0), 0, "USD Dolar", 18, "USD", true);
      MiniMeToken token = tokenFactory.createCloneToken(MiniMeToken(address(0)), 0, "DevToken", 18, "XDT", true);

      acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

      Vault vault;
      Finance finance;
      TokenManager tokenManager;
      (vault, finance, payroll, tokenManager) = deployApps(dao);

      // token manager initialization
      token.changeController(tokenManager); // token manager has to create tokens

      // permissions
      setVaultPermissions(acl, vault, finance, root);

      vault.initialize();
      finance.initialize(vault, financePeriodDuration);
      payroll.initialize(finance, denominationToken, priceFeed, rateExpiryTime);
      tokenManager.initialize(token, true, 0);
      //
      // acl.createPermission(this, tokenManager, tokenManager.MINT_ROLE(), this);
      //
      // tokenManager.mint(this, amount);
      // token.approve(finance, amount);
      // finance.deposit(token, amount, "Initial deployment");


      // Payroll permissions
      acl.createPermission(employer, payroll, payroll.ADD_EMPLOYEE_ROLE(), root);
      acl.createPermission(employer, payroll, payroll.TERMINATE_EMPLOYEE_ROLE(), root);
      acl.createPermission(employer, payroll, payroll.ALLOWED_TOKENS_MANAGER_ROLE(), root);
      acl.createPermission(employer, payroll, payroll.SET_EMPLOYEE_SALARY_ROLE(), root);
      acl.createPermission(employer, payroll, payroll.ADD_ACCRUED_VALUE_ROLE(), root);
      acl.createPermission(root, payroll, payroll.CHANGE_PRICE_FEED_ROLE(), root);
      acl.createPermission(root, payroll, payroll.MODIFY_RATE_EXPIRY_ROLE(), root);

      // Finance permissions
      acl.createPermission(payroll, finance, finance.CREATE_PAYMENTS_ROLE(), root);

      // setTokenManagerPermissions(acl, tokenManager, root);

      // EVMScriptRegistry permissions
      // EVMScriptRegistry reg = EVMScriptRegistry(dao.getApp(dao.APP_ADDR_NAMESPACE(), EVMSCRIPT_REGISTRY_APP_ID));
      // acl.createBurnedPermission(reg, reg.REGISTRY_ADD_EXECUTOR_ROLE());
      // acl.createBurnedPermission(reg, reg.REGISTRY_MANAGER_ROLE());

      cleanupDAOPermissions(dao, acl, root);

      emit DeployInstance(dao);
    }

    function deployApps(Kernel dao) internal returns (Vault, Finance, Payroll, TokenManager) {
      bytes32 vaultAppId = apmNamehash("vault");
      bytes32 financeAppId = apmNamehash("finance");
      bytes32 payrollAppId = apmNamehash("payroll");
      bytes32 tokenManagerAppId = apmNamehash("token-manager");

      Vault vault = Vault(dao.newAppInstance(vaultAppId, latestVersionAppBase(vaultAppId)));
      Finance finance = Finance(dao.newAppInstance(financeAppId, latestVersionAppBase(financeAppId)));
      Payroll payroll = Payroll(dao.newAppInstance(payrollAppId, latestVersionAppBase(payrollAppId)));
      TokenManager tokenManager = TokenManager(dao.newAppInstance(tokenManagerAppId, latestVersionAppBase(tokenManagerAppId)));

      emit InstalledApp(vault, vaultAppId);
      emit InstalledApp(finance, financeAppId);
      emit InstalledApp(payroll, payrollAppId);
      emit InstalledApp(tokenManager, tokenManagerAppId);

      return (vault, finance, payroll, tokenManager);
    }

    function setVaultPermissions(ACL acl, Vault vault, Finance finance, address root) internal {
      bytes32 vaultTransferRole = vault.TRANSFER_ROLE();
      acl.createPermission(finance, vault, vaultTransferRole, this); // manager is this to allow 2 grants
      acl.grantPermission(root, vault, vaultTransferRole);
      acl.setPermissionManager(root, vault, vaultTransferRole); // set root as the final manager for the role
    }

    function setTokenManagerPermissions(ACL acl, TokenManager tokenManager, address root) internal {
        // token manager permissions
        acl.createPermission(ANY_ENTITY, tokenManager, tokenManager.MINT_ROLE(), root);
        acl.createPermission(ANY_ENTITY, tokenManager, tokenManager.ISSUE_ROLE(), root);
        acl.createPermission(ANY_ENTITY, tokenManager, tokenManager.ASSIGN_ROLE(), root);
        acl.createPermission(ANY_ENTITY, tokenManager, tokenManager.REVOKE_VESTINGS_ROLE(), root);
    }

    function deployTokens(Finance finance) internal {
      MiniMeToken token1 = tokenFactory.createCloneToken(MiniMeToken(0), 0, "Token 1", 18, "TK1", true);
      // MiniMeToken token2 = tokenFactory.createCloneToken(MiniMeToken(0), 0, "Token 2", 18, "TK2", true);
      // MiniMeToken token3 = tokenFactory.createCloneToken(MiniMeToken(0), 0, "Token 3", 18, "TK3", true);

      token1.generateTokens(this, amount);
      // token2.generateTokens(this, amount);
      // token3.generateTokens(this, amount);

      token1.approve(finance, amount);
      // token2.approve(finance, amount);
      // token3.approve(finance, amount);

      finance.deposit(token1, amount, "Initial deployment");
      // finance.deposit(token2, amount, "Initial deployment");
      // finance.deposit(token3, amount, "Initial deployment");
    }

    function onApprove(address, address, uint) public returns (bool) {
        return true;
    }
}
