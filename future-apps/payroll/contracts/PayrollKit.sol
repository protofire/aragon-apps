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

      MiniMeToken denominationToken = newToken("USD Dolar", "USD");
      MiniMeToken token = newToken("DevToken", "XDT");

      acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

      Vault vault;
      Finance finance;
      (vault, finance, payroll) = deployApps(dao);

      // Setup the permissions for the Finance App
      setFinancePermissions(acl, finance, payroll, root);

      // Setup the permissions for the vault
      setVaultPermissions(acl, vault, finance, root);

      // Payroll permissions
      setPayrollPermissions(acl, payroll, root);

      vault.initialize();
      finance.initialize(vault, financePeriodDuration);
      payroll.initialize(finance, denominationToken, priceFeed, rateExpiryTime);
      deployTokens(dao, finance, acl, root);

      address(finance).send(10 ether);

      addEmployees(payroll, root);

      cleanupDAOPermissions(dao, acl, root);

      emit DeployInstance(dao);
    }

    function deployApps(Kernel dao) internal returns (Vault, Finance, Payroll) {
      bytes32 vaultAppId = apmNamehash("vault");
      bytes32 financeAppId = apmNamehash("finance");
      bytes32 payrollAppId = apmNamehash("payroll");
      bytes32 tokenManagerAppId = apmNamehash("token-manager");

      Vault vault = Vault(dao.newAppInstance(vaultAppId, latestVersionAppBase(vaultAppId)));
      Finance finance = Finance(dao.newAppInstance(financeAppId, latestVersionAppBase(financeAppId)));
      Payroll payroll = Payroll(dao.newAppInstance(payrollAppId, latestVersionAppBase(payrollAppId)));

      emit InstalledApp(vault, vaultAppId);
      emit InstalledApp(finance, financeAppId);
      emit InstalledApp(payroll, payrollAppId);

      return (vault, finance, payroll);
    }

    function setVaultPermissions(ACL acl, Vault vault, Finance finance, address root) internal {
      bytes32 vaultTransferRole = vault.TRANSFER_ROLE();
      acl.createPermission(finance, vault, vaultTransferRole, this); // manager is this to allow 2 grants
      acl.grantPermission(root, vault, vaultTransferRole);
      acl.setPermissionManager(root, vault, vaultTransferRole); // set root as the final manager for the role
    }

    function setFinancePermissions(ACL acl, Finance finance, Payroll payroll, address root) internal {
      acl.createPermission(payroll, finance, finance.CREATE_PAYMENTS_ROLE(), root);

      // acl.createPermission(root, finance, finance.CHANGE_PERIOD_ROLE(), root);
      // acl.createPermission(root, finance, finance.CHANGE_BUDGETS_ROLE(), root);
      // acl.createPermission(root, finance, finance.EXECUTE_PAYMENTS_ROLE(), root);
      // acl.createPermission(root, finance, finance.MANAGE_PAYMENTS_ROLE(), root);
    }

    function setPayrollPermissions(ACL acl, Payroll payroll, address root) internal {
      acl.createPermission(this, payroll, payroll.ADD_EMPLOYEE_ROLE(), this);
      acl.grantPermission(root, payroll, payroll.ADD_EMPLOYEE_ROLE());
      acl.setPermissionManager(root, payroll, payroll.ADD_EMPLOYEE_ROLE());

      acl.createPermission(this, payroll, payroll.ALLOWED_TOKENS_MANAGER_ROLE(), this);
      acl.grantPermission(root, payroll, payroll.ALLOWED_TOKENS_MANAGER_ROLE());
      acl.setPermissionManager(root, payroll, payroll.ALLOWED_TOKENS_MANAGER_ROLE());

      // acl.createPermission(employer, payroll, payroll.TERMINATE_EMPLOYEE_ROLE(), root);
      // acl.createPermission(employer, payroll, payroll.SET_EMPLOYEE_SALARY_ROLE(), root);
      // acl.createPermission(employer, payroll, payroll.ADD_ACCRUED_VALUE_ROLE(), root);
      // acl.createPermission(employer, payroll, payroll.CHANGE_PRICE_FEED_ROLE(), root);
      // acl.createPermission(root, payroll, payroll.MODIFY_RATE_EXPIRY_ROLE(), root);
    }

    function deployTokens(Kernel dao, Finance finance, ACL acl, address root) internal {
      deployAndDepositToken(dao, finance, acl, root, "Token 1", "TK1");
      deployAndDepositToken(dao, finance, acl, root, "Token 2", "TK2");
    }

    function deployAndDepositToken(
        Kernel dao,
        Finance finance,
        ACL acl,
        address root,
        string name,
        string symbol
    ) internal {
        TokenManager tokenManager = newTokenManager(dao, acl, root);
        MiniMeToken token = newToken(name, symbol);
        token.changeController(tokenManager);
        tokenManager.initialize(token, true, 0);
        tokenManager.mint(this, amount);
        token.approve(finance, amount);
        finance.deposit(token, amount, "Initial deployment");
    }

    function newToken(string name, string symbol) internal returns (MiniMeToken token) {
        token = tokenFactory.createCloneToken(MiniMeToken(0), 0, name, 18, symbol, true);
    }

    function newTokenManager(Kernel dao, ACL acl, address root) internal returns (TokenManager tokenManager) {
        bytes32 tokenManagerAppId = apmNamehash("token-manager");
        tokenManager = TokenManager(dao.newAppInstance(tokenManagerAppId, latestVersionAppBase(tokenManagerAppId)));
        emit InstalledApp(tokenManager, tokenManagerAppId);
        setTokenManagerPermissions(acl, tokenManager, root);
    }

    function setTokenManagerPermissions(ACL acl, TokenManager tokenManager, address root) internal {
      acl.createPermission(this, tokenManager, tokenManager.MINT_ROLE(), root);
      // acl.createPermission(root, tokenManager, tokenManager.ISSUE_ROLE(), root);
      // acl.createPermission(root, tokenManager, tokenManager.ASSIGN_ROLE(), root);
      // acl.createPermission(root, tokenManager, tokenManager.REVOKE_VESTINGS_ROLE(), root);
      // acl.createPermission(root, tokenManager, tokenManager.BURN_ROLE(), root);
    }

    function addEmployees(Payroll payroll, address root) internal {
        payroll.addEmployeeWithNameAndStartDate(address(0), 10, 'employee 1', uint64(now));
        payroll.addEmployeeWithNameAndStartDate(this, 20, 'employee 2', uint64(now- 86400));
        payroll.addEmployeeWithNameAndStartDate(root, 30, 'employee 3',  uint64(now - 172800));
    }
}
