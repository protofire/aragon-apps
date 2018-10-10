pragma solidity 0.4.24;

import "@aragon/ppf-contracts/contracts/IFeed.sol";


contract PPFMock is IFeed {
  function get(address base, address quote) external view returns (uint128 xrt, uint64 when) {
      xrt = 1;
      when = uint64(now);
  }
}
