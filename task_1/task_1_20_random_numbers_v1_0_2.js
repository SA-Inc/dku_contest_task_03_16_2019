'use strict';

// Задание #1
// 1. Сгенерировать 20 чисел. 
// 2. Найти 2 числа, между которыми самая минимальная разница. Вывести их индексы.
// 3. Найти еще 2 числа, между которыми самая минимальная разница. Вывести их индексы.

const getRandomNumber = (min = 0, max = 100) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);

const searchMinDistance = (array, bitmask) => {
   let minDist = Number.MAX_SAFE_INTEGER;
   let minDistIdx1 = null;
   let minDistIdx2 = null;

   for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
         // Process only Elements below Main Diagonal.
            if (j < i && bitmask[i] !== 1 && bitmask[j] !== 1) {
               let tempDist = Math.abs(array[i] - array[j]);

               if (tempDist < minDist) {
                  minDist = tempDist;
                  minDistIdx1 = i;
                  minDistIdx2 = j;
               }
            }
             
      }
   }

   return {minDist, minDistIdx1, minDistIdx2};
}

(() => {
   // Random Numbers.
   const numbersCount = 20;
   let numbers = [];
   let numbersBitmask;

   // Random 20 different Numbers.
   for (let i = 0; i < numbersCount; i++) {
      let tempRandonNumber = getRandomNumber();

      if (!numbers.includes(tempRandonNumber)) {
         numbers[i] = tempRandonNumber;
      } else {
         i--;
      }
   }

   // Create Bitmask for Array of random Numbers.
   numbersBitmask = new Array(numbers.length);
   numbersBitmask.fill(0);

   console.log(numbers);

   for (let i = 1; i <= 2; i++) {
      let {minDist, minDistIdx1, minDistIdx2} = searchMinDistance(numbers, numbersBitmask);

      numbersBitmask[minDistIdx1] = 1;
      numbersBitmask[minDistIdx2] = 1;

      console.log('');
      console.log(`Min Dist ${i}: ${minDist}`);
      console.log(`Min Dist ${i} Index 1: ${minDistIdx1}`);
      console.log(`Min Dist ${i} Index 2: ${minDistIdx2}`);
      console.log(`Bitmask: ${numbersBitmask}`);
   }
})();