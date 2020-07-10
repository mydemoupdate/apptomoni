import user from './auth/repositories/user'
import passport from './auth/repositories/passport'
import group from "./auth/repositories/group";
import permissions from "./auth/repositories/permissions";
import Product from "./Product";
import Origin from "./Origin";
import Supplier from "./Supplier";
import Unit from "./Unit";
import Taxes from "./Taxes";
import Ingredients from "./Ingredients";
import Package from "./Package";
import Order from "./Order";
import Log from "./Log";
import Transaction from "./Transaction";
import Role from "./Role";
import Permisson from "./Permisson";
import Account from "./Account";
import Receipts from "./Receipts";
import TransactionTypes from "./TransactionTypes";
import Purchases from "./Purchases";
import Shipment from "./Shipment";
import Cart from "./Cart";

const repositories = {
    'users': user,
    'passport': passport,
    'group': group,
    'permissions': permissions,
    'products': Product,
    'origins': Origin,
    'supplier': Supplier,
    'units': Unit,
    'taxes': Taxes,
    'ingredients': Ingredients,
    'package': Package,
    'order': Order,
    'log': Log,
    'transaction': Transaction,
    'transactiontype': TransactionTypes,
    'role': Role,
    'permisson': Permisson,
    'account': Account,
    'receipt': Receipts,
    'purchase': Purchases,
    'shipment': Shipment,
    'cart': Cart
}

export default {
    get: name => repositories[name]
}
