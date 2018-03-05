<template>
  <div>
    <div class="game-board">
      <table cellspacing="0">
        <tr v-bind:key="rowIndex" v-for="(row, rowIndex) in game">
          <td 
            v-bind:key="columnIndex" 
            v-for="(column, columnIndex) in row" 
            v-on:click="click(rowIndex, columnIndex)"
          >
            <transition name="fade">
              <span v-if="game[rowIndex][columnIndex]">
                {{ game[rowIndex][columnIndex] }}
              </span>
            </transition>
          </td>
        </tr>
      </table>
      <p v-if="winner">Game is over! Winner is {{ winner }}</p>
      <button 
        class="reset-button" 
        v-if="emptyCellCount() !== 9" 
        v-on:click="reset"
      >
        RESTART
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TicTacToe',
  methods: {
    isDone: function isDone() {
      for (let i = 0; i < 3; i++) {
        // yana dogru xxx veya ooo oldu mu?
        if (this.game[i][0] && this.game[i][0] === this.game[i][1] && 
          this.game[i][0] === this.game[i][2]) {
          return true;
        } 

        // asagi dogru xxx veya ooo oldu mu?
        if (this.game[0][i] && this.game[0][i] === this.game[1][i] && 
          this.game[0][i] === this.game[2][i]) {
          return true;
        } 
      }
      
      // sagdan sola carprazlama
      if (this.game[0][0] && 
        this.game[0][0] === this.game[1][1] && 
        this.game[0][0] === this.game[2][2]) {
        return true;
      }

      // soldan saga carprazlama
      if (this.game[0][2] && 
        this.game[0][2] === this.game[1][1] && 
        this.game[0][2] === this.game[2][0]) {
        return true;
      }
     
      return false;
    },
    reset: function reset() {
      // oyun durumunu sifirliyoruz:
      this.turn = 'X';
      this.winner = null;
      this.game = [['', '', ''], ['', '', ''], ['', '', '']];
    },
    moveComputer: function moveComputer() {
      // TODO brute-force kullanma, azicik akilli oynasin :(
      // bilgisayar icin O koyabilecegi bir nokta ariyor
      let randomX;
      let randomY;
      do {
        randomX = Math.floor(Math.random() * 3);
        randomY = Math.floor(Math.random() * 3);
      } while (this.game[randomX][randomY] !== '');

      this.game[randomX][randomY] = 'O';

      // sira oyuncuya gecti
      this.turn = 'X';
    }, 
    // kac hucre hala bos?  
    emptyCellCount: function emptyCellCount() {
      // icice iki for'la yapabilirdik, boylesi daha havali, ooo
      return this.game.reduce((total, row) => 
        total + row.reduce((rowSum, cell) => 
          cell === '' ? rowSum + 1 : rowSum, 0
        ), 0);
    },
    click: function click(x, y) {
      // oyun bittiyse, basilan yer doluysa, sira kullanicida degilse birsey yapma
      if (this.winner || this.game[x][y] || this.turn === 'O') {
        return;
      }

      this.game[x][y] = 'X';

      // sira bilgisayarda
      this.turn = 'O';

      // kullanicinin hamlesiyle oyun bittiyse kazanan X
      if (this.isDone()) {
        this.winner = 'X';
      } 

      // kullanicinin hamlesiyle tum hucreler dolduysa ve kazanamadiysa
      // oyun berabere bitti
      else if (this.emptyCellCount() === 0) {
        this.winner = '*dostluk*';
      } 

      // aksi durumda *gecikmeyle* bilgisayari hareket ettir
      // known bug: animasyon suresi arttikca gorsel 
      // senkron problemleri basgosterebilir.
      // known bug #2: bilgisayar dusunurken oyunu yeniden baslatinca
      // oyun resetlendikten sonra X ms sonra karakter yaziliyor.
      else { 
        setTimeout(() => {
          this.moveComputer();

          // bilg hareket ettikten oyunu kazandi mi?
          if (this.isDone()) {
            this.winner = 'O';
          }
          this.$forceUpdate();
        }, 1500);
      } 
      
      this.$forceUpdate();
    },
  },
  data() {
    return {
      turn: 'X',
      winner: null,
      game: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ]
    };
  },
};
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.game-board table {
  margin: 0 auto;
}

.game-board td {
  font-size: 30px;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.game-board tr:first-child td,
.game-board tr:nth-child(2) td {
  border-bottom: 1px solid #ccc;
}

.game-board tr td:first-child,
.game-board tr td:nth-child(2) {
  border-right: 1px solid #ccc;
}

.reset-button {
  border: none;
  background-color: pink;
  padding: 10px;
  margin-top: 20px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
