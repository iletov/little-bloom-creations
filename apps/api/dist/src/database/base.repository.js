"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const database_provider_1 = require("./database.provider");
const transaction_manager_1 = require("./transaction.manager");
class BaseRepository {
    get db() {
        const tx = transaction_manager_1.TransactionManager.getTransaction();
        return tx ?? database_provider_1.db;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map