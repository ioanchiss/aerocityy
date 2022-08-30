pragma solidity ^0.8.6;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol"; 
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Crowdfunding is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public usdt;
    IERC20 public tutToken;

    struct presaleData {
        uint256 cost;
        uint256 goal;
        uint256 startPresale;
        uint256 deadlinePresale;
        uint256 balance;  //USDT TOKEN
        uint256 tutTokenSupply; //AIRPORT TOKEN 
        uint256 balanceOfOwner;  //USDT 99%
        uint256 remainingTutTokens; //AIRPORT TOKENS RAMAINING IN CONTRACT AFTER 
    }

    mapping(uint256 => mapping(address => uint256)) public allocationPerPresale;
    mapping(uint256 => mapping(address => uint256)) public  rewardPerPresale;
    mapping(uint256 => presaleData ) public  dataAboutPresale;

    address public devAddress;
    uint256 devReward;
    uint256 ownerReward;
    uint16 refundFeePercent = 8000;
    uint16 devFeePercent = 100;
    bool setStagesFlag = false;
    bool sendTUTToContract = false;
    uint256 allowClaimTokens = 0;
    uint256[] presaleArray;

    constructor(address _devAddress, address _usdt, address _rwd, uint256[] memory presaleNumbers, uint256[] memory costs, uint256[] memory goals, uint256 numberOfDays) {
        devAddress = _devAddress;
        usdt = IERC20(_usdt);
        tutToken = IERC20(_rwd);
        uint256 startPresale = block.timestamp;
        uint256 deadlinePresale = startPresale + numberOfDays * 1 minutes;
        for(uint256 i=0; i<presaleNumbers.length; i++){
             setStages(presaleNumbers[i], costs[i], goals[i], startPresale ,deadlinePresale);
             startPresale = deadlinePresale + 1;
             deadlinePresale = block.timestamp + numberOfDays*(i+2) *1 minutes;
        }
        setStagesFlag = true;
        allowClaimTokens = startPresale;
        presaleArray = presaleNumbers;
    }

    function setStages(uint256 _presaleNumber, uint256 cost, uint256 goal, uint256 startPresale, uint256 deadlinePresale) public  onlyOwner{
        require(!setStagesFlag, "Only 4 presale are allowed!");
        dataAboutPresale[_presaleNumber].cost = cost  *10 **18;
        dataAboutPresale[_presaleNumber].goal = goal *10 **18;
        dataAboutPresale[_presaleNumber].startPresale = startPresale;
        dataAboutPresale[_presaleNumber].deadlinePresale = deadlinePresale;
        dataAboutPresale[_presaleNumber].balance = 0;
        dataAboutPresale[_presaleNumber].balanceOfOwner = 0;
    }

    function sendTutTokensToContract(uint256 amount) public onlyOwner{
       require(!sendTUTToContract, "Already send TUT to contract!");
       uint256 totalAmountOfTut = 0;
        for (uint256 i=0; i<presaleArray.length; i++){
            totalAmountOfTut += dataAboutPresale[presaleArray[i]].goal / dataAboutPresale[presaleArray[i]].cost;
        }
        require(totalAmountOfTut * 10**18 == amount, "You must introduce total amount of TUT tokens");
        for(uint256 i=0; i<presaleArray.length; i++){
            uint256 value = dataAboutPresale[presaleArray[i]].goal / dataAboutPresale[presaleArray[i]].cost *10 **18;
            dataAboutPresale[presaleArray[i]].tutTokenSupply = value;
            dataAboutPresale[presaleArray[i]].remainingTutTokens = value;
        }
        sendTUTToContract = true;
        tutToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    function contribute(uint256 amountOfUSDT) public nonReentrant{
        uint256 currentPhase = getCurrentPhase();
        require(sendTUTToContract ,"Aerocity: In this moment does not exist fund on contract!");
        require(currentPhase != 0, "Aerocity:  In this moment does not exist a presale period!");
        require(amountOfUSDT <= (dataAboutPresale[currentPhase].goal-dataAboutPresale[currentPhase].balance), "Aerocity: The amount entered exceeds the required amount until the goal is reached");
        require(amountOfUSDT >= 10**17,"Aerocity: The amount entered is invalid! Please enter a maximum of 2 decimal places");

        uint256 amountOfTokens = (amountOfUSDT *1000) / dataAboutPresale[currentPhase].cost;
        uint256 devFee = amountOfUSDT * devFeePercent / 10000;
        require(dataAboutPresale[currentPhase].tutTokenSupply >= amountOfTokens,"Aerocity: There are no enought tokens for reward");
        dataAboutPresale[currentPhase].balance += amountOfUSDT;
        allocationPerPresale[currentPhase][msg.sender] += amountOfUSDT;
        rewardPerPresale[currentPhase][msg.sender] += amountOfTokens * 10**15;

        usdt.safeTransferFrom(msg.sender, address(this), amountOfUSDT-devFee);
        usdt.safeTransferFrom(msg.sender, devAddress, devFee);

        dataAboutPresale[currentPhase].balanceOfOwner += amountOfUSDT - devFee;
        dataAboutPresale[currentPhase].remainingTutTokens -= amountOfTokens * 10**15;

    }

    function claimRemainingFunds() public onlyOwner nonReentrant{
        require(block.timestamp >= allowClaimTokens,"Aerocity: Current time must be >= deadline"); 
        uint256 usdtToWithdraw = 0;
        uint256 tutTokensToWithdraw = 0;

        for(uint256 i=0;i<presaleArray.length;i++){
            if(dataAboutPresale[presaleArray[i]].balanceOfOwner > 0){
                 usdtToWithdraw += dataAboutPresale[presaleArray[i]].balanceOfOwner;
                 dataAboutPresale[presaleArray[i]].balanceOfOwner = 0;
                 dataAboutPresale[presaleArray[i]].balance = 0;
            }
            if(dataAboutPresale[presaleArray[i]].remainingTutTokens > 0){
                 tutTokensToWithdraw += dataAboutPresale[presaleArray[i]].remainingTutTokens;
                 dataAboutPresale[presaleArray[i]].tutTokenSupply -= dataAboutPresale[presaleArray[i]].remainingTutTokens;
                 dataAboutPresale[presaleArray[i]].remainingTutTokens = 0;
            }
        }

        require(usdtToWithdraw > 0 || tutTokensToWithdraw > 0, "Aerocity: In this moment does not remaing fund to withdraw!");
        require(usdtToWithdraw <= usdt.balanceOf(address(this)), "Aerocity: Insufficiente balance of usdt in contract!");
        if(usdtToWithdraw > 0 ){
            usdt.approve(address(this),usdtToWithdraw);
            usdt.safeTransferFrom(address(this), msg.sender, usdtToWithdraw);
        }

        require(tutTokensToWithdraw <= tutToken.balanceOf(address(this)), "Aerocity: Insufficiente balance of TUT in contract!");
        if(tutTokensToWithdraw > 0 ){
            tutToken.approve(address(this),tutTokensToWithdraw);
            tutToken.safeTransferFrom(address(this), msg.sender, tutTokensToWithdraw);
          }
    }

    function claimTokens() public nonReentrant{
        require(block.timestamp > allowClaimTokens , "Aerocity: In this moment you can not claim your tokens!");
        uint256 totalContribution = 0;
        for(uint256 i=0;i<presaleArray.length;i++){
            if(rewardPerPresale[presaleArray[i]][msg.sender] > 0){
                 totalContribution += rewardPerPresale[presaleArray[i]][msg.sender];
                 dataAboutPresale[presaleArray[i]].tutTokenSupply -= rewardPerPresale[presaleArray[i]][msg.sender];
                 rewardPerPresale[presaleArray[i]][msg.sender] = 0;
            }
        }

        require(totalContribution > 0 , "Aerocity: You did not contribute in this project!");
        require(tutToken.balanceOf(address(this)) >= totalContribution, "Aerocity: The contract does not have sufficient funds");
       
        tutToken.approve(address(this),totalContribution+1);
        tutToken.safeTransferFrom(address(this), msg.sender, totalContribution);
    }

    function getRefund(uint256 amount) public nonReentrant{
        uint256 currentPhase = getCurrentPhase();
        require(currentPhase != 0, "Aerocity:  In this moment does not exist a presale period!");
        require(allocationPerPresale[currentPhase][msg.sender] > 0, "Aerocity: You do not contribute in this presale");
        require(dataAboutPresale[currentPhase].balance > 0,"Aerocity: Current balance of presale period must be > 0");
        require(amount < allocationPerPresale[currentPhase][msg.sender], "Aerocity: The amount entered is greater than the contribution from this presale");
        require(block.timestamp <= dataAboutPresale[currentPhase].deadlinePresale && block.timestamp >= dataAboutPresale[currentPhase].startPresale, "Aerocity: The presale period is over!");  
        require(amount >= 10**17,"Aerocity: The amount entered is invalid! Please enter a maximum of 2 decimal places!");
        uint256 refundAmount = amount * refundFeePercent / 10000;
        uint256 numberOfTutTokens = amount * 1000 / dataAboutPresale[currentPhase].cost;

        require(dataAboutPresale[currentPhase].balance >= refundAmount, "Aerocity: Balance of contract must be > refound amount");
        usdt.approve(address(this), refundAmount);
        usdt.safeTransferFrom(address(this), msg.sender, refundAmount);

        dataAboutPresale[currentPhase].balance -= refundAmount;
        dataAboutPresale[currentPhase].balanceOfOwner -= refundAmount;
        dataAboutPresale[currentPhase].remainingTutTokens +=  numberOfTutTokens * 10**15;
       
        allocationPerPresale[currentPhase][msg.sender] -= amount;
        rewardPerPresale[currentPhase][msg.sender] -= numberOfTutTokens * 10**15;
    }

    function setDevAddress(address _devAddress) public {
        require(devAddress == msg.sender, "Aerocity: Msg.sender must be developer address!");
        devAddress = _devAddress;
    }

    function getGoal(uint256 _presaleNumber) public view returns(uint256){
        return dataAboutPresale[_presaleNumber].goal;
    }

    function getCost(uint256 _presaleNumber) public view returns(uint256){
        return dataAboutPresale[_presaleNumber].cost;
    }

    function getBalance(uint256 _presaleNumber) public view returns(uint256){
        return dataAboutPresale[_presaleNumber].balance;
    }

    function getDeadline( uint256 _presaleNumber) public view returns(uint256){
        return dataAboutPresale[_presaleNumber].deadlinePresale;
    }

    function getStartPresale(uint256 _presaleNumber) public view returns(uint256){
        return dataAboutPresale[_presaleNumber].startPresale;
    }

    function getTotalAmountOfTUT() public view returns(uint256){
       uint256 totalAmountOfTut = 0;
            for (uint256 i=0; i<presaleArray.length; i++){
            totalAmountOfTut += dataAboutPresale[presaleArray[i]].goal / dataAboutPresale[presaleArray[i]].cost;
        }
        return totalAmountOfTut * 10**18;
    }
    
    function getRemainedTimeForCurrentPresale() public view returns(uint256){
        uint256 currentPhase = getCurrentPhase();
        if(currentPhase == 0){
         return 0;
            }else{
         return dataAboutPresale[currentPhase].deadlinePresale - block.timestamp;
        }
    }

    function getFundsLeftToRiseForCurrentPresale() public view returns(uint256){
        uint256 currentPhase = getCurrentPhase();
         if(currentPhase == 0){
           return 0;
            }else{
           return dataAboutPresale[currentPhase].goal-dataAboutPresale[currentPhase].balance;
        }
    }

    function getCurrentPhase() public view returns(uint256) {
        for(uint256 i=0; i<presaleArray.length; i++){
            if(block.timestamp >= dataAboutPresale[presaleArray[i]].startPresale && block.timestamp<=dataAboutPresale[presaleArray[i]].deadlinePresale){
                return presaleArray[i];
            }
        }
        return 0;
    }

    function getAllowClaimTokens() public view returns(uint256){
        return allowClaimTokens;
    }

     function getCurrentTime() public view returns(uint256){
        return block.timestamp;
    }

    function getAllocation(address userAddress, uint256 _presaleNumber) public view returns(uint256){
        return  allocationPerPresale[_presaleNumber][userAddress];
    }

    function getRewardPerPresale(address userAddress, uint256 _presaleNumber) public view returns(uint256){
        return rewardPerPresale[_presaleNumber][userAddress];
    }

    function getTotalAirpotToken(address _address) public view returns(uint256){
        uint256 totalTokens = 0;
          for(uint256 i=0; i<presaleArray.length;i++){
             totalTokens += rewardPerPresale[presaleArray[i]][_address];
          }
        return totalTokens;
    }

}
