"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionManager = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
const database_provider_1 = require("./database.provider");
let TransactionManager = class TransactionManager {
    static storage = new async_hooks_1.AsyncLocalStorage();
    static getTransaction() {
        return this.storage.getStore();
    }
    static async runInTransaction(operation) {
        const currentTx = this.getTransaction();
        if (currentTx) {
            return operation();
        }
        return database_provider_1.db.transaction(async (tx) => {
            return this.storage.run(tx, operation);
        });
    }
};
exports.TransactionManager = TransactionManager;
exports.TransactionManager = TransactionManager = __decorate([
    (0, common_1.Injectable)()
], TransactionManager);
//# sourceMappingURL=transaction.manager.js.map