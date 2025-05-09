// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign{
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address []donators;
        uint256 []donations;
    }

    mapping(unint256 =>Campaign) public campaign;

    uint256 public numberOfCampaigns=0;

    function createCampaign(address _owner,string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _deadline,string memory _image) public returns uint256{
        Campaign storage campaign=campaign[numberOfCampaigns];

        //is everything okay?
        require(campaign.deadline<block.timestamp, "The Deadline should be a date in the future.");
        campaign.owner=_owner;
        campaign.title=_title;
        campaign.description=_description;
        campaign.deadline=_deadline;
        campaign.amountCollected=0;
        campaign.image=_image;

        numberOfCampaigns++;
        return numberOfCampaigns-1;

    }

    function donateteCampaign(uint256 _id) public payable{
        uint256 amount=msg.value;

        Campaign storage campaign=campaign[_id];
        campaign.donations.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent)=payable(campaign.owner).call{value:amount}("");

        if(sent){
            campaign.amountCollected=campaign.amountCollected + amount;
        }


    }

    function getDonators(uint256 _id,) view public return(address[] memory,uint256[] memory){
        return (campaign[_id].donators,campaign[_id].donations);
    }

    function getCampaigns() public view (Campaign[] memory){
        Campaign[] memory allCampaigns=new Campaign[](numberOfCampaigns);

        for(uint i=0;i<numberOfCampaigns;i++){
            Campaign storage item=campaigns[i];

            allCampaigns[i]=item;
        }

        return allCampaigns;
    }

}