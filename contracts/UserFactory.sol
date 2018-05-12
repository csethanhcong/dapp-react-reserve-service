pragma solidity ^0.4.21;

contract UserFactory {

    struct User {
        string userPhoneNo;
        string userName;
        string userAddress;
        bool isOwner; // to check this user is guest or owner
    }

    // Index owner'address for filter on web3 later
    event NewUserCreated(
        address indexed from,
        uint userId,
        string userPhoneNo,
        string userName,
        string userAddress,
        bool isOwner
    );

    User[] public users;

    mapping (address => bool) public addressToIsUser;
    mapping (address => uint) public addressToUserId;

    // ============= Modifiers ================
    modifier onlyUser {
        require(addressToIsUser[msg.sender]);
        _;
    }

    modifier onlyOwnerUser {
        require(addressToIsUser[msg.sender]);

        uint userId = addressToUserId[msg.sender];
        User memory currentUser = users[userId];
        require(currentUser.isOwner);

        _;
    }

    // ============= Private / Internal functions ================

    // ============= Public / External functions ================

    function isUser() public view returns (bool) {
        return addressToIsUser[msg.sender];
    }

    function getCurrentUserInfo() external view returns (
        uint userId,
        string userPhoneNo,
        string userName,
        string userAddress,
        bool isOwner
    ) {
        userId = addressToUserId[msg.sender];
        User memory currentUser = users[userId];

        userPhoneNo = currentUser.userPhoneNo;
        userName = currentUser.userName;
        userAddress = currentUser.userAddress;
        isOwner = currentUser.isOwner;
    }

    function createUser(
        string _userPhoneNo,
        string _userName,
        string _userAddress,
        bool _isOwner
    ) external returns (uint userId) {
        User memory newUser = User({
            userPhoneNo: _userPhoneNo,
            userName: _userName,
            userAddress: _userAddress,
            isOwner: _isOwner
        });

        userId = users.push(newUser) - 1;
        addressToUserId[msg.sender] = userId;
        addressToIsUser[msg.sender] = true;

        emit NewUserCreated(
            msg.sender,
            userId,
            _userPhoneNo,
            _userName,
            _userAddress,
            _isOwner
        );
    }

}
