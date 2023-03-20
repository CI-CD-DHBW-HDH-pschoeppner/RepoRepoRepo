<script lang="ts">
  import {
    Field,
    getBlanks,
    invertPlayer,
    Outcome,
    Player,
  } from "../logic/game";
  import { createEventDispatcher } from "svelte";
  import type {
    MoveMessage,
    Offer,
  } from "../logic/online/websocket";
  import { sendMove } from "../logic/online/websocket";

  export let board: Field[];
  export let fieldToString: (arg0: Field) => string;
  export let player: Player;
  export let enemy: Player;

  let playerID = "";
  let selfID = "";

  let currentPlayer: Field = Field.PLAYER1 | Field.PLAYER2;
  currentPlayer = Field.PLAYER1;

  const dispatch = createEventDispatcher();

  function getCurrentPlayer(): Player {
    if (currentPlayer === player.field) return player;
    return enemy;
  }

  function getInvertedPlayer(): Player {
    if (currentPlayer === player.field) return enemy;
    return player;
  }

  function onClickHandler(index: number) {
    if (getCurrentPlayer().isOnline()) return; // effectively disable the board, when it is not the local players move
    moveHandler(index);
  }

  function moveHandler(index: number) {
    if (!setField(index, getCurrentPlayer().field)) return;
    if (getInvertedPlayer().isOnline()) {
      const onlinePlayer = getInvertedPlayer();
      if (
        playerID !== "" &&
        selfID !== "" &&
        onlinePlayer.connection !== undefined
      ) {   
        sendMove(playerID,selfID,index,board,player.connection!)
      } else {
        console.error(`failed to send move to player ${playerID}`);
      }
    }
    currentPlayer = invertPlayer(currentPlayer);
    if (!getCurrentPlayer().isHuman() && !getCurrentPlayer().isOnline()) {
      const i = getCurrentPlayer().move(board);
      setField(i, getCurrentPlayer().field);
      currentPlayer = invertPlayer(currentPlayer);
    }
  }

  function setField(index: number, value: Field): boolean {
    if (board[index] !== Field.EMPTY) return false;
    if (new Outcome(board).finished) return false;
    board[index] = value;
    board = board;
    return true;
  }

  $: {
    let outcome = new Outcome(board);
    if (outcome.finished) {
      dispatch<"finished">("finished", outcome);
    }
  }

  $: {
    if (getBlanks(board).length === 9) {
      currentPlayer = Field.PLAYER1;
      if (!getCurrentPlayer().isHuman() && !getCurrentPlayer().isOnline()) {
        const i = getCurrentPlayer().move(board);
        setField(i, getCurrentPlayer().field);
        currentPlayer = Field.PLAYER2;
      }
    }
  }

  $: {
    if (enemy.isOnline() && enemy.connection === undefined) {
      // TODO: implement enemy connecting to the websocket server
      // implement logic for enemy going online
      // the enemy needs to connect here to the websocket server (have a look at ./src/logic/online/websocket.ts)
      // every player connecting to the server is expected to have a unique username
    } else if (!enemy.isOnline() && enemy.connection !== undefined) {
      enemy.connection.close();
      enemy.connection = undefined;
      selfID = "";
      playerID = "";
    }
    if (player.isOnline() && player.connection === undefined) {
      // TODO: Implement the player connecting to the websocket server
      // this is the same logic as above, but for the player rather than the enemy
    } else if (!player.isOnline() && player.connection !== undefined) {
      player.connection.close();
      player.connection = undefined;
      selfID = "";
      playerID = "";
    }
  }

  function join() {
    // TODO: Implement join method
    // if the enemy (O) is the online player, send the offer to join accordingly
    // else, send the offer for the player
  }

  function onlineHandler(
    player: Field.PLAYER1 | Field.PLAYER2
  ): (event: MessageEvent<string>) => void {
    return (event: MessageEvent<string>) => {
      const data: Offer | MoveMessage = JSON.parse(event.data) as
        | Offer
        | MoveMessage;
      if (isOffer(data)) {
        playerID = data.ownID;
        // if the offer proposes a different setup than expected, the receiver switches sides
        // this decreases the complexity of the "handshake"
        if (data.preferredSide !== player) { 
          dispatch<"switch">("switch");
        }
      } else if (isMoveMessage(data)) {
        // TODO: what should happen, if the online player sends its move?
      }
    };
  }

  // these are just type assertions, to parse the received message correctly
  const isOffer = (msg: any): msg is Offer => {
    if ((msg as Offer).preferredSide) return true;
    return false;
  };
  const isMoveMessage = (msg: any): msg is MoveMessage => {
    if ((msg as MoveMessage).board) return true;
    return false;
  };
</script>

<div id="board">
  <div id="grid">
    {#each board as field, index}
      <div
        class="field"
        id={index.toString()}
        on:click={() => onClickHandler(index)}
        on:keydown={() => onClickHandler(index)}
      >
        {fieldToString(field)}
      </div>
    {/each}
  </div>
  <div
    id="online"
    style="display: {player.isOnline() || enemy.isOnline() ? 'flex' : 'none'}"
  >
    <span>{selfID}</span>
    <input type="text" bind:value={playerID} placeholder="remote player ID" />
    <button type="button" on:click={join} disabled={playerID !== ""}
      >connect</button
    >
  </div>
</div>

<style>
  #board {
    display: flex;
    flex-direction: column;
    height: 50%;
    aspect-ratio: 1;
    overflow-y: visible;
  }
  #grid {
    min-height: 100%;
    aspect-ratio: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    background-color: var(--primary);
    position: relative;
    border-radius: 7.5%;
    box-shadow: 0 0 20px var(--secondaryAccent);
  }
  .field {
    padding: 0;
    margin: 0;
    --border: 0.25rem solid var(--primaryAccent); /*border variable*/
    font-size: 300%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Comic Sans MS";
    cursor: pointer;
    user-select: none;
  }
  .field:nth-child(-n + 3) {
    /*first row*/
    border-bottom: var(--border);
  }
  .field:nth-child(n + 4):nth-child(-n + 6) {
    /*second row*/
    border-bottom: var(--border);
    border-top: var(--border);
  }
  .field:nth-child(n + 7) {
    /*last row*/
    border-top: var(--border);
  }
  .field:nth-child(3n + 1) {
    /*first column*/
    border-right: var(--border);
  }
  .field:nth-child(3n + 2) {
    /*second column*/
    border-right: var(--border);
    border-left: var(--border);
  }
  .field:nth-child(3n) {
    /*last column*/
    border-left: var(--border);
  }
  #online {
    display: flex;
    box-sizing: border-box;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
    background-color: var(--primary);
    padding: 10px;
    border-radius: 15px;
  }
</style>
