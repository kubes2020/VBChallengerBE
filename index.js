require("dotenv").config();
const server = require("./server");

const PORT = process.env.PORT || 4220;

server.listen(PORT, () => {
    console.log(`\n listening on port ${PORT}`);
});
