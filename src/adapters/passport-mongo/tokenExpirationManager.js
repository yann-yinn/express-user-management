const optionsManager = require('../../options');

module.exports = {
    getCollection() {
        return require("./db").collection(optionsManager.get().tokensCollection);
    },
    async newTokenForUser(username, token) {
        await this.getCollection().updateOne(
            { token },
            { $set: { username, since: new Date().toJSON() } },
            { upsert: true }
        );
    },
    async isTokenValid(tokenToCheck) {
        const token = await this.getCollection().findOne({token: tokenToCheck });
        if (!!token) {
            await this.getCollection().updateOne(
                { token: tokenToCheck },
                { $set: { lastUsed : new Date().toJSON() } }
            );
            return true;
        } else {
            return false;
        }
    },
    async listTokens() {
        const tokenDocuments = await this.getCollection().find().toArray();
        return tokenDocuments;
    },
    async revokeToken(token) {
        await this.getCollection().deleteOne({ token });
    }
}