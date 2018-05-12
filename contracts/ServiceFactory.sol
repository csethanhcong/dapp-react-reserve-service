pragma solidity ^0.4.21;

import "./UserFactory.sol";
import "./DSVToken.sol";

// interface token {
//     function transfer(address _to, uint _value) external returns (bool success);
//     function transferFrom(address _from, address _to, uint _value) external returns (bool success);
//     function balanceOf(address _owner) external constant returns (uint balance);
//     function allowance(address _owner, address _spender) external constant returns (uint remaining);
// }

contract ServiceFactory is UserFactory, DSVToken {

    // Constants
    // 1 paid ETH = 1000 DSVToken, because price of service paid in finney
    uint rewardTokenRatio = 1 finney;

    // DSVTokenReward
    // token public DSVTokenReward;

    // function ServiceFactory(address _DSVTokenAddress) public {
    //     DSVTokenReward = token(_DSVTokenAddress);
    // }

    struct Service {
        address owner;
        string name;
        string description;
        uint price;             // In finney
        bool canPayByDSVToken;  // Check whether owner of service want to be paid in DSVToken or not
        bool isReserved;
    }

    // This struct used for address refer to its services later, without
    // duplicating struct Service above
    struct ServiceId {
        uint serviceId;
    }

    // Index owner'address for filter on web3 later
    event NewServiceCreated(
        address indexed owner,
        string name,
        string description,
        uint price,
        bool canPayByDSVToken,
        bool isReserved
    );

    event ServiceReserved(
        address indexed from,
        uint serviceId,
        bool paidInDSVToken,
        uint price
    );

    event TokenRewardSent(
        address indexed to,
        uint value,
        bool success
    );

    Service[] public services;

    mapping (uint => address) public serviceIdToReservedUserAddress;
    mapping (address => ServiceId[]) addressToServiceIds;

    // ============= Modifiers ================

    // ============= Private / Internal functions ================

    // ============= Public / External functions ================

    // function test() external {
    //     uint allowedAmount = DSVTokenReward.allowance(msg.sender, address(this));
    //     emit Test(this, allowedAmount);
    // }

    function getServicesLength() external view returns (uint) {
        return services.length;
    }

    function getServiceAtIndex(uint _index) external view returns (
        address owner,
        string name,
        string description,
        uint price,
        bool canPayByDSVToken,
        bool isReserved
    ) {
        Service memory service = services[_index];
        owner = service.owner;
        name = service.name;
        description = service.description;
        price = service.price;
        canPayByDSVToken = service.canPayByDSVToken;
        isReserved = service.isReserved;
    }

    function createService(
        string _name,
        string _description,
        uint _price,
        bool _canPayByDSVToken
    ) onlyOwnerUser external returns (uint serviceId) {

        Service memory newService = Service({
            owner: msg.sender,
            name: _name,
            description: _description,
            price: _price,
            canPayByDSVToken: _canPayByDSVToken,
            isReserved: false
        });

        serviceId = services.push(newService) - 1;

        emit NewServiceCreated(
            msg.sender,
            _name,
            _description,
            _price,
            _canPayByDSVToken,
            false
        );
    }

    // User firstly have to call approve amount of token to allow contract
    // spend this amount to pay for service
    // This should be achieved in front-end
    function reserveServiceByDSVToken(uint _serviceId) onlyUser external returns (bool) {
        Service storage service = services[_serviceId];

        require(service.canPayByDSVToken == true);
        require(service.isReserved == false);

        uint servicePrice = service.price;
        uint currentUserBalance = balanceOf(msg.sender);

        // Amount of allowed token must be gte than price in DSVToken
        // Because price of service in finney so, servicePriceInDSVToken = servicePrice
        uint servicePriceInDSVToken = servicePrice;
        require(currentUserBalance >= servicePriceInDSVToken);

        // Transfer DSVToken from user to service owner
        balances[msg.sender] = sub(balances[msg.sender], servicePriceInDSVToken);
        balances[service.owner] = add(balances[service.owner], servicePriceInDSVToken);

        // Update service's status
        service.isReserved = true;
        emit ServiceReserved(msg.sender, _serviceId, true, servicePriceInDSVToken);

        // Save to further reference
        serviceIdToReservedUserAddress[_serviceId] = msg.sender;
        addressToServiceIds[msg.sender].push(ServiceId(_serviceId));

        return true;
    }

    function reserveServiceByETH(uint _serviceId) onlyUser external payable returns (bool) {
        Service storage service = services[_serviceId];
        uint servicePrice = service.price;
        uint valueTransferedInFinney = msg.value / 1000000000000000;

        require(service.isReserved == false);
        require(valueTransferedInFinney >= servicePrice);

        // Transfer ETH value to owner of service
        // `transfer` here is native-transfer function of contract address
        address owner = service.owner;
        owner.transfer(servicePrice * 1 finney);

        // Update service's status
        service.isReserved = true;
        emit ServiceReserved(msg.sender, _serviceId, false, servicePrice);

        // Save to further reference
        serviceIdToReservedUserAddress[_serviceId] = msg.sender;
        addressToServiceIds[msg.sender].push(ServiceId(_serviceId));

        // Reward user that reserve service
        uint amount = valueTransferedInFinney;

        // Reward user an amount of DSVToken when paied in ETH
        // It requires current contract owner has enough DSVToken to reward users
        bool success = this.transfer(msg.sender, amount);
        emit TokenRewardSent(msg.sender, amount, success);

        return true;
    }
}
