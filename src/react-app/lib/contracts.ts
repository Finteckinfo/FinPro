import { APP_CONFIG } from './config';

export const FIN_TOKEN_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)",
    "function decimals() public view returns (uint8)"
];

export const PROJECT_ESCROW_ABI = [
    "function fundProject(uint256 amount) external returns (uint256 projectId)",
    "function getProject(uint256 projectId) external view returns (address employer, uint256 totalFunded, uint256 totalAllocated, uint256 totalReleased, uint8 status, uint256 createdAt, uint256 refundRequestedAt)",
    "event ProjectFunded(uint256 indexed projectId, address indexed employer, uint256 amount)"
];

export const CONTRACT_ADDRESSES = APP_CONFIG.contracts;
