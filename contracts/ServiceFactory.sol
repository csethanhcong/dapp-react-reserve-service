pragma solidity ^0.4.2;

import "./UserFactory.sol";

interface token {
    function transfer(address _to, uint _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint _value) external returns (bool success);
    function balanceOf(address _owner) external constant returns (uint balance);
    function allowance(address _owner, address _spender) external constant returns (uint remaining);
}

contract ServiceFactory is UserFactory {

    // Constants
    // 1 paid ETH = 1000 RESToken, because price of service paid in finney
    uint rewardTokenRatio = 1 finney;

    // RESTokenReward
    token public RESTokenReward;

    function ServiceFactory(address _RESTokenAddress) public {
        RESTokenReward = token(_RESTokenAddress);
    }

    struct Service {
        address serviceOwner;
        string serviceName;
        string startTime;
        uint price;             // In finney
        bool canPayByRESToken;  // Check whether owner of service want to be paid in RESToken or not
        bool isReserved;
    }

    // Index owner'address for filter on web3 later
    event NewServiceCreated(
        address indexed serviceOwner,
        string serviceName,
        string startTime,
        uint price,
        bool canPayByRESToken,
        bool isReserved
    );

    event ServiceReserved(
        address indexed from,
        uint serviceId,
        bool paidInRESToken,
        uint price
    );

    event TokenRewardSent(
        address indexed to,
        uint value,
        bool success
    );

    event Test(address current, uint value);

    Service[] public services;

    mapping (uint => address) public serviceIdToReservedUserAddress;
    mapping (address => uint) public addressToServiceId;

    // ============= Modifiers ================

    // ============= Private / Internal functions ================

    // ============= Public / External functions ================

    function test() external {
        uint allowedAmount = RESTokenReward.allowance(msg.sender, address(this));
        emit Test(this, allowedAmount);
    }

    // User firstly have to call approve amount of token to allow contract
    // spend this amount to pay for service
    // This should be achieved in front-end
    function reserveServiceByRESToken(uint _serviceId) external {
        Service storage service = services[_serviceId];

        require(service.canPayByRESToken == true);
        require(service.isReserved == false);

        uint servicePrice = service.price;
        uint allowedAmount = RESTokenReward.allowance(msg.sender, this);
        emit Test(this, allowedAmount);

        // Amount of allowed token must be gte than price in RESToken
        require(allowedAmount >= servicePrice);

        // Update service's status
        service.isReserved = true;
        emit ServiceReserved(msg.sender, _serviceId, true, servicePrice);

        // Save to further reference
        serviceIdToReservedUserAddress[_serviceId] = msg.sender;

        address serviceOwner = service.serviceOwner;

        RESTokenReward.transferFrom(msg.sender, serviceOwner, servicePrice);
    }

    function reserveServiceByETH(uint _serviceId) external payable {
        Service storage service = services[_serviceId];
        uint servicePrice = service.price;

        require(service.isReserved == false);
        require(msg.value >= servicePrice * 1 finney);

        // Transfer ETH value to owner of service
        address serviceOwner = service.serviceOwner;
        serviceOwner.transfer(servicePrice * 1 finney);

        // Update service's status
        service.isReserved = true;
        emit ServiceReserved(msg.sender, _serviceId, false, servicePrice);

        // Save to further reference
        serviceIdToReservedUserAddress[_serviceId] = msg.sender;

        // Reward user that reserve service
        uint amount = msg.value;

        bool success = RESTokenReward.transfer(msg.sender, amount / rewardTokenRatio);
        emit TokenRewardSent(msg.sender, amount / rewardTokenRatio, success);
    }

    function createService(
        string _serviceName,
        string _startTime,
        uint _price,
        bool _canPayByRESToken
    ) external returns (uint serviceId) {

        Service memory newService = Service({
            serviceOwner: msg.sender,
            serviceName: _serviceName,
            startTime: _startTime,
            price: _price,
            canPayByRESToken: _canPayByRESToken,
            isReserved: false
        });

        serviceId = services.push(newService) - 1;

        emit NewServiceCreated(
            msg.sender,
            _serviceName,
            _startTime,
            _price,
            _canPayByRESToken,
            false
        );
    }

}
