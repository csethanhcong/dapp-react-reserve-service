pragma solidity ^0.4.21;

import "./ERC20.sol";
import "./Owned.sol";
import "./SafeMath.sol";

contract DSVToken is ERC20, Owned, SafeMath{

  string public symbol;
  string public  name;
  uint8 public decimals;
  uint public totalSupply;

  // ------------------------------------------------------------------------
  // Constructor
  // ------------------------------------------------------------------------
  function DSVToken() public {
    /* owner = msg.sender; */
    // Give all tokens to this contract address
    owner = this;
    symbol = "DSV";
    name = "DSV Token";
    decimals = 0;
    totalSupply = 1000000 * 10**uint(decimals); // 1,000,000 DSVToken
    balances[owner] = totalSupply;
  }

  mapping (address => uint) internal balances;
  mapping (address => mapping (address => uint)) internal allowed;

  function totalSupply() public constant returns (uint) {
    return totalSupply  - balances[address(0)];
  }

  function transfer(address _to, uint _value) public returns (bool success){
    balances[msg.sender] = sub(balances[msg.sender], _value);
    balances[_to] = add(balances[_to], _value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint _value) public returns (bool success) {
    var _allowance = allowed[_from][msg.sender];

    balances[_to] = add(balances[_to], _value);
    balances[_from] = sub(balances[_from], _value);
    allowed[_from][msg.sender] = sub(_allowance, _value);
    Transfer(_from, _to, _value);
    return true;
  }

  function balanceOf(address _owner) public constant returns (uint balance) {
    return balances[_owner];
  }

  function approve(address _spender, uint _value) public returns (bool success) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) public constant returns (uint remaining) {
    return allowed[_owner][_spender];
  }
}
// ================= Standard Token Contract end ========================
