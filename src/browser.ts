/* eslint-disable @typescript-eslint/no-explicit-any */

import { KeypairService, TransactionService, AccountService, BtcClient } from "./index";

(window as any).btc = {
  KeypairService,
  TransactionService,
  AccountService,
  BtcClient
};