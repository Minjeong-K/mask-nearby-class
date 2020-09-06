// for 문
const numInfo = {one: 'first', two: 'second', three: 'third'};
for (const i in numInfo) {
  console.log (`기수 : ${i}, 서수: ${numInfo[i]}`);
}

const oddNums = [1, 3, 5, 7, 9];
for (const i of oddNums) {
  // 이터러블(반복가능한) 객제는  of 사용
  console.log (i);
}

// while 문
let i = 0;
while (i < 10) {
  console.log (i);
  i++;
}

// prompt 를 사용한 Input
let score = prompt ('점수를 입력하세요.', 0);
if (score >= 90) {
  console.log ('A+');
} else if (score >= 80) {
  console.log ('B+');
} else {
  console.log ('C+');
}

// 중첩된 if문으로 해석
let score = prompt ('점수를 입력하세요.', 0);
if (score >= 90) {
  console.log ('A+');
} else {
  if (score >= 80) {
    console.log ('B+');
  } else {
    console.log ('C+');
  }
}
