import { BrowserProvider, Contract, parseEther } from "ethers";

const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb68988881282a";
const NFT_ADDRESS = "0x3cA8723b1DE36dFB5261f84a814CfA5d0Eb358f5";
//CodiumAI: test this function

//Calling this function will transfer a cUSD0.1 to the above address
export const transferCUSD = async (address: string, userAddress: string) => {
    if (window.ethereum) {
        //Get connected accounts, if not connected request connection.
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(userAddress);

        // The current selected account out of the connected accounts. 
        let abi = ["function transfer (address to, uint256 value)"];
        const CUSDContract = new Contract(CUSD_ADDRESS, abi, signer); // a dummy NFT contract
        let txn = await CUSDContract.transfer(address, parseEther("0.1"));
        let receipt = await txn.await();
    }
}

//CodiumAI: Test this function
export const mintNFT = async (url: string, userAddress: string) => {
    if (window.ethereum) {
        //Get connected accounts, if not connected request connection.
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(userAddress);

        // The current selected account out of the connected accounts.

        let abi = ["function safeMint(address to, string uri)"];
        const NFTContract = new Contract(NFT_ADDRESS, abi, signer);
        let txn = await NFTContract.safeMint(userAddress, url);
        let receipt = await txn.wait();     
    }
}
//CodiumAI: Test this function
export const getNFT = async (userAddress: string) => {
    // Get connected accounts, if not connected request connection.
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(userAddress);

    let abi = [
        "function getTokenOf(address owner) public view returns (uint256[] memory)",
        "function tokenURI(uint256 tokenId) public view returns (string memory)",
    ];
    const NFTContract = new Contract(NFT_ADDRESS, abi, signer);
    let res = await NFTContract.getTokenOf(userAddress);

    let urls = await Promise.all(
        res.map(async (token: any) => {
            let url = await NFTContract.tokenURI(token);
            return url;
        })
    );
    return urls;
};

declare global {
    interface window {
        ethereum: any;
    }
}
