pragma solidity ^0.4.2;

contract UserFactory {

    struct User {
        string userPhoneNo;
        string userName;
        string userAddress;
        bool isGuest; // to check this user is guest or owner
    }

    // Index owner'address for filter on web3 later
    event NewUserCreated(
        address indexed from,
        uint userId,
        string userPhoneNo,
        string userName,
        string userAddress,
        bool isGuest
    );

    User[] public users;

    mapping (address => uint) public addressToUserId;

    // ============= Modifiers ================

    // ============= Private / Internal functions ================

    // ============= Public / External functions ================

    function getCurrentUserInfo() external view returns (
        uint userId,
        string userPhoneNo,
        string userName,
        string userAddress,
        bool isGuest
    ) {
        userId = addressToUserId[msg.sender];
        User memory currentUser = users[userId];

        userPhoneNo = currentUser.userPhoneNo;
        userName = currentUser.userName;
        userAddress = currentUser.userAddress;
        isGuest = currentUser.isGuest;
    }

    function createUser(
        string _userPhoneNo,
        string _userName,
        string _userAddress,
        bool _isGuest
    ) external returns (uint userId) {
        User memory newUser = User({
            userPhoneNo: _userPhoneNo,
            userName: _userName,
            userAddress: _userAddress,
            isGuest: _isGuest
        });

        userId = users.push(newUser) - 1;
        addressToUserId[msg.sender] = userId;

        NewUserCreated(
            msg.sender,
            userId,
            _userPhoneNo,
            _userName,
            _userAddress,
            _isGuest
        );
    }

}
