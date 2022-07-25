import assert from "assert";
import ganache from "ganache-cli";
import Web3 from "web3";
import contract from "../compile.js";

const web3 = new Web3(ganache.provider());

let manager, players, lottery;

describe("Lottery contract", () => {
  beforeEach("Deploy a new contract", async () => {
    const accounts = await web3.eth.getAccounts();
    manager = accounts[0];
    players = accounts.slice(1, 3);

    lottery = await new web3.eth.Contract(contract.abi)
      .deploy({
        data: contract.evm.bytecode.object,
      })
      .send({
        from: manager,
        gas: "1000000",
      });
  });

  it("contract deployed", () => {
    assert.ok(lottery.options.address);
  });

  it("Manager is set", async () => {
    const result = await lottery.methods.manager().call();
    assert.equal(manager, result);
  });

  it("Player enter with 1 ether", async () => {
    await lottery.methods.enter().send({
      from: players[0],
      gas: "1000000",
      value: web3.utils.toWei("1"),
    });

    const result = await lottery.methods.players(0).call();
    assert.equal(players[0], result);
  });

  it("Player enter with less that 1 ether", async () => {
    try {
      await lottery.methods.enter().send({
        from: players[1],
        gas: "1000000",
        value: web3.utils.toWei("0.9"),
      });
      assert(false);
    } catch (revertError) {
      assert(revertError);
    }
  });

  it("Player 0 wins and manager get fees", async () => {
    await lottery.methods.enter().send({
      from: players[0],
      gas: "1000000",
      value: web3.utils.toWei("1"),
    });

    const managerBalance = await web3.eth.getBalance(manager);
    const player0Balance = await web3.eth.getBalance(players[0]);
    await lottery.methods.pickWinner().send({
      from: manager,
      gas: "1000000",
    });

    await lottery.methods.withdraw().send({
      from: manager,
      gas: "1000000",
    });
    await lottery.methods.withdraw().send({
      from: players[0],
      gas: "1000000",
    });

    const managerBalanceAfterPickWinner = await web3.eth.getBalance(manager);
    const player0BalanceAfterPickWinner = await web3.eth.getBalance(players[0]);

    const managerBalanceDiff = managerBalanceAfterPickWinner - managerBalance;
    const player0BalanceDiff = player0BalanceAfterPickWinner - player0Balance;

    assert(managerBalanceDiff > 0, "Manager should get fees");
    assert(player0BalanceDiff > 0, "Player 0 should get prize");
  });
});
