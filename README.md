# Decentralized Crowdfunding Platform

This project is a decentralized crowdfunding platform built on the Ethereum blockchain. It allows users to create fundraising campaigns, and other users to donate Ether to these campaigns.

## Functionalities

*   **Create a Campaign:** Users can launch a new campaign by providing:
    *   Title of the campaign
    *   Detailed description
    *   Funding target (in ETH)
    *   Deadline for the campaign
    *   An image URL for campaign visuals
*   **Donate to a Campaign:** Users can contribute Ether to active campaigns.
    *   **Important:** Donations are transferred directly to the campaign owner's wallet immediately upon a successful transaction. They are not held in an escrow by the smart contract.
*   **View Campaigns:** Browse all created campaigns, view their details, progress, and deadlines.
*   **View Donation History:** See who has donated to a specific campaign and the amounts they contributed.

## Tech Stack

*   **Frontend:**
    *   React
    *   Vite
    *   Tailwind CSS
    *   Ethers.js (for blockchain interaction)
    *   Thirdweb (for project setup and potentially other utilities)
*   **Backend (Smart Contract):**
    *   Solidity
    *   Hardhat (for development, testing, and deployment)

## How it Works (Smart Contract Logic - `CrowdFunding.sol`)

The core logic is managed by the `CrowdFunding.sol` smart contract:

*   **`Campaign` Struct:** Each campaign is represented by a struct containing:
    *   `owner`: The address of the campaign creator.
    *   `title`: Campaign title.
    *   `description`: Campaign description.
    *   `target`: The funding goal in Wei.
    *   `deadline`: The Unix timestamp for when the campaign ends.
    *   `amountCollected`: Total Ether collected (in Wei).
    *   `image`: URL for the campaign image.
    *   `donators`: An array of addresses that have donated.
    *   `donations`: An array of donation amounts corresponding to the donators.

*   **`createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image)`:**
    *   Allows users to create a new campaign.
    *   Requires the deadline to be in the future.
    *   Stores the new campaign in a mapping and increments `numberOfCampaigns`.

*   **`donateToCampaign(uint256 _id)`:**
    *   A payable function allowing users to send Ether to a campaign specified by its `_id`.
    *   The `msg.value` (amount of Ether sent) is recorded.
    *   The sender's address (`msg.sender`) and the donation amount are added to the campaign's `donators` and `donations` arrays.
    *   **Crucially, the received Ether (`msg.value`) is immediately transferred to the `campaign.owner` address.**
    *   The `campaign.amountCollected` is updated if the transfer is successful.

*   **`getDonators(uint256 _id)`:**
    *   A view function that returns the list of donator addresses and their corresponding donation amounts for a specific campaign.

*   **`getCampaigns()`:**
    *   A view function that returns an array of all campaigns created on the platform.

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (which includes npm) or [Yarn](https://yarnpkg.com/)
*   [Hardhat](https://hardhat.org/getting-started/#installation): `npm install --save-dev hardhat` or `yarn add --dev hardhat` (globally or per project)
*   [MetaMask](https://metamask.io/) browser extension (or a similar Ethereum wallet provider).

## Setup and Running the Project

The project is divided into two main parts: the backend (smart contract) and the frontend (client application).

### 1. Backend (Smart Contract - `web3./` directory)

This handles the deployment and management of the `CrowdFunding.sol` smart contract.

1.  **Navigate to the `web3` directory:**
    ```bash
    cd web3.
    ```
2.  **Install dependencies:**
    ```bash
    yarn install
    # OR
    npm install
    ```
3.  **Compile the smart contract:**
    This will generate ABI files and typechain typings if configured.
    ```bash
    yarn build
    # OR
    npm run build
    ```
4.  **Deploy the smart contract:**
    *   **Local Development (Hardhat Network):**
        Hardhat comes with a built-in local Ethereum network for development. You can deploy your contract to this network using a deploy script (e.g., `scripts/deploy.js`).
        ```bash
        npx hardhat run scripts/deploy.js --network localhost
        ```
        Make sure your `hardhat.config.js` is configured for the local network.
    *   **Testnets or Mainnet:**
        To deploy to a live network (e.g., Sepolia, Mainnet), you'll need:
        *   An RPC URL for the desired network (e.g., from Alchemy or Infura).
        *   A private key of the account you want to deploy from (funded with test ETH for testnets).
        *   Configure these in your `hardhat.config.js` and potentially a `.env` file (e.g., `PRIVATE_KEY`, `RPC_URL`).
        The `web3./README.md` (which will be removed) mentions using thirdweb's deploy:
        ```bash
        yarn deploy -- -k <your-secret-key> # (using thirdweb secret key)
        # OR
        npm run deploy -- -k <your-secret-key>
        ```
        Refer to Hardhat and thirdweb documentation for detailed deployment instructions.

5.  **Update Frontend with Contract Details:**
    After successful deployment, you will get a contract address. You also need the contract's ABI (Application Binary Interface).
    *   **Contract Address:** Update the `address` field in `client/src/constants/CrowdFunding.json`.
    *   **ABI:** The ABI can be found in the artifacts generated by Hardhat after compilation (usually in `web3./artifacts/contracts/CrowdFunding.sol/CrowdFunding.json`). Copy the ABI array into the `abi` field in `client/src/constants/CrowdFunding.json`. Ensure the ABI is correctly formatted as a JSON array.

### 2. Frontend (Client Application - `client/` directory)

This is the React application that users interact with.

1.  **Navigate to the `client` directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    yarn install
    # OR
    npm install
    ```
3.  **Environment Variables (if any):**
    The original `client/README.md` mentioned a `CLIENT_ID` for thirdweb services. If you plan to use thirdweb's dashboard or specific client-side features, create a `.env` file in the `client/` directory and add necessary variables:
    ```
    VITE_THIRDWEB_CLIENT_ID=your_client_id_here
    ```
    (Note: Vite requires environment variables to be prefixed with `VITE_`).
    For the core crowdfunding functionality as per `CrowdFunding.sol`, this might not be strictly necessary unless thirdweb SDK components are used for wallet connection or contract interaction that rely on it.

4.  **Run the development server:**
    ```bash
    yarn dev
    # OR
    npm run dev
    ```
    This will start the Vite development server, typically on `http://localhost:5173`.

## Project Structure

*   `client/`: Contains the React frontend application.
    *   `src/`: Source files for the frontend.
        *   `context/Web3Context.tsx`: Manages wallet connection and smart contract interaction.
        *   `constants/CrowdFunding.json`: Stores the deployed contract address and ABI.
        *   `pages/`: Different pages of the application (Home, Create Campaign, etc.).
        *   `components/`: Reusable UI components.
*   `web3./`: Contains the Solidity smart contract and Hardhat development environment.
    *   `contracts/`: Solidity smart contract files (`CrowdFunding.sol`).
    *   `scripts/`: Deployment and interaction scripts.
    *   `hardhat.config.js`: Hardhat configuration file.

## Important Notes & Caveats

*   **Direct Donation Transfer:** As highlighted, donations are sent directly to the campaign owner's wallet. This is a key design choice of the current smart contract and differs from platforms that hold funds in escrow until a target is met or a deadline is reached. Ensure users are aware of this.
*   **No Withdrawal Function for Owners:** Since funds are transferred immediately, there's no separate "withdraw" function in the smart contract for campaign owners to claim collected funds.
*   **Security:** Smart contract security is paramount. The provided contract is an example; for a production system, it should undergo a thorough security audit.

## Future Improvements (Potential Ideas)

*   **Escrow Functionality:** Modify the contract to hold donated funds until the campaign target is met or the deadline is reached. Implement logic for fund release to the owner or refunds to donators.
*   **Campaign Cancellation:** Allow campaign owners to cancel campaigns and return funds.
*   **Voting/Milestones:** For larger projects, implement milestone-based fund releases governed by donator voting.
*   **Enhanced UI/UX:** Improve the user interface for better campaign discovery, filtering, and user profiles.
*   **Gas Optimization:** Review and optimize contract functions to reduce gas costs.

---

This README provides a comprehensive guide to understanding, setting up, and running the Decentralized Crowdfunding Platform.
```
