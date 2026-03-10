

export default {
  solidity: {
    version: "0.8.20",
    settings: {
      evmVersion: "paris"
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545",
      type: "http"
    }
  }
};
