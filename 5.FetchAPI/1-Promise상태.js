// promise의 세 가지 상태
// 1. Pending (대기)
// 2. Resolved (이행)
// 3. Rejected (거절)

promiseTest1 = (timer) => {
    let promiseObj = new Promise((resolve, reject) => {
        setTimeout(() => {
            // resolve 함수를 통해 메세지를 반환해 줍니다.
            resolve(`Timer : ${timer}`)
        }, timer)
    })
    // 반환된 메세지는 then 함수를 통해 익명함수의 매개변수
    // 여기서는 value로 들어가게 되고, console.(value)로 출력됩니다.
    promiseObj.then((value) => console.log(value))
}

function promiseTest2(timer) {
    // status를 랜덤으로 만듭니다.
    // Math.floor() : 바닥함수 -> 소수점 이하를 버립니다.
    // Math .random() : 0~1 사이의 랜덤한 숫자를 반환합니다.
    const status = Math.floor(Math.random() * 10) % 2
    console.log(status)
    let promiseObj = new Promise((resolve, reject) => {
        // 랜덤으로 뽑은 status 가 1 이면 resolve
        // status 가 0 이면 reject로 메세지를 반환합니다.
        setTimeout(() => {
            if (status === 1) resolve('성공!')
            else reject('실패..')
        }, timer)
    })
    promiseObj
        .then((value) => console.log(value))
        .catch((error) => console.log(error))
}
