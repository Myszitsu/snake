const playground = document.querySelector('.playground')
const snake = document.querySelector('.snake')
const apple = document.querySelector('.apple')
const span = document.querySelector('.span')
const btn = document.querySelector('.btn')
const h1 = document.querySelector('.h1')
const snakes = [snake]
let difficulty = 50
let interval
let direction = ''
let lost = 0
let range = 180
let h = range
let rangeFlipper = 0
let score = difficulty
let isReady = true
let hasStarted = 0

const check = {
	direction: 0,
	translated: false,
}

const size = {
	width: 1200,
	height: 660,
}

span.textContent = score
apple.style.top = Math.floor(Math.random() * (size.height / 15)) * 15 + 'px'
apple.style.left = Math.floor(Math.random() * (size.width / 15)) * 15 + 'px'
snake.style.top = `${size.height / 2 - 15}px`
snake.style.left = `${size.width / 2 - 15}px`

const position = {
	top: +snake.style.top.slice(0, -2),
	left: +snake.style.left.slice(0, -2),
}

const setColor = el => {
	h = range
	el.style.backgroundColor = `hsl(${h}, 80%, 50%)`
	if (range < 360 && rangeFlipper === 0) {
		range++
	} else if (range === 360) {
		rangeFlipper = 1
		range--
	} else {
		range--
		if (range === 180) {
			rangeFlipper = 0
		}
	}
}

const app = () => {
	const snakeEl = document.createElement('div')
	snakeEl.classList.add('snake')
	snakeEl.style.top = snakes[snakes.length - 1].style.top
	snakeEl.style.left = snakes[snakes.length - 1].style.left
	setColor(snakeEl)

	playground.append(snakeEl)
	snakes.push(snakeEl)
}

const grow = () => {
	if (snakes.length === 1) {
		snakes[0].style.backgroundColor = `hsl(${h}, 80%, 50%)`
	}
	apple.style.top = Math.floor(Math.random() * (size.height / 15)) * 15 + 'px'
	apple.style.left = Math.floor(Math.random() * (size.width / 15)) * 15 + 'px'
	app()
	score--
	span.style.color = `hsl(${h}, 80%, 50%)`
	span.textContent = score
}

const dirCheck = e => {
	if (hasStarted === 0) {
		h1.classList.remove('active')
		hasStarted = 1
	}
	if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
		direction = -1
		clearInterval(interval)
	} else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
		direction = 1
		clearInterval(interval)
	}
}

// const movementVertical = () => {
// 	if (
// 		(snakes.length > 1 && position.top + 15 * direction === +snakes[1].style.top.slice(0, -2)) ||
// 		(snakes.length > 1 && check.translated && check.direction === direction)
// 	) {
// 		direction *= -1
// 	}
// 	position.top += 15 * direction
// 	if (snakes.length > 1) {
// 		for (let i = snakes.length - 1; i > 0; i--) {
// 			snakes[i].style.left = snakes[i - 1].style.left
// 			snakes[i].style.top = snakes[i - 1].style.top
// 		}
// 		snakes[0].style.top = `${position.top}px`
// 	} else if (snakes.length === 1) {
// 		snakes[0].style.top = `${position.top}px`
// 	}

// 	isReady = true
// }
const movementVertical = () => {
	if (snakes.length > 1) {
		if (
			position.top + 15 * direction === +snakes[1].style.top.slice(0, -2) ||
			(check.translated && check.direction === direction)
		) {
			direction *= -1
		}
		position.top += 15 * direction
		for (let i = snakes.length - 1; i > 0; i--) {
			snakes[i].style.left = snakes[i - 1].style.left
			snakes[i].style.top = snakes[i - 1].style.top
		}
		snakes[0].style.top = `${position.top}px`
	} else {
		position.top += 15 * direction
		snakes[0].style.top = `${position.top}px`
	}

	isReady = true
}

// const movementHorizontal = () => {
// 	if (
// 		(snakes.length > 1 && position.left + 15 * direction === +snakes[1].style.left.slice(0, -2)) ||
// 		(snakes.length > 1 && check.translated && check.direction === direction)
// 	) {
// 		direction *= -1
// 	}
// 	position.left += 15 * direction

// 	if (snakes.length > 1) {
// 		for (let i = snakes.length - 1; i > 0; i--) {
// 			snakes[i].style.left = snakes[i - 1].style.left
// 			snakes[i].style.top = snakes[i - 1].style.top
// 		}
// 		snakes[0].style.left = `${position.left}px`
// 	} else if (snakes.length === 1) {
// 		snakes[0].style.left = `${position.left}px`
// 	}

// 	isReady = true
// }
const movementHorizontal = () => {
	if (snakes.length > 1) {
		if (
			position.left + 15 * direction === +snakes[1].style.left.slice(0, -2) ||
			(check.translated && check.direction === direction)
		) {
			direction *= -1
		}
		position.left += 15 * direction

		for (let i = snakes.length - 1; i > 0; i--) {
			snakes[i].style.left = snakes[i - 1].style.left
			snakes[i].style.top = snakes[i - 1].style.top
		}
		snakes[0].style.left = `${position.left}px`
	} else {
		position.left += 15 * direction
		snakes[0].style.left = `${position.left}px`
	}

	isReady = true
}

const win = () => {
	clearInterval(interval)
	h1.classList.add('win')
	if (size.width <= 570) {
		h1.textContent = 'you won'
	} else {
		h1.textContent = 'collected all apples'
	}
	lost = 1
	apple.style.display = 'none'
	btn.classList.add('active')
}

const defeat = () => {
	clearInterval(interval)
	snakes.forEach(s => (s.style.backgroundColor = 'red'))
	h1.classList.add('lost')
	h1.textContent = 'game over'
	lost = 1
	apple.style.display = 'none'
	btn.classList.add('active')
}

// const checkPosition = () => {
// 	if (snakes[0].getBoundingClientRect().left === playground.getBoundingClientRect().right) {
// 		snakes[0].style.left = `0px`
// 		position.left = +snake.style.left.slice(0, -2)
// 	} else if (snakes[0].getBoundingClientRect().left + 15 === playground.getBoundingClientRect().left) {
// 		snakes[0].style.left = playground.clientWidth - 15 + 'px'
// 		position.left = +snake.style.left.slice(0, -2)
// 	} else if (snakes[0].getBoundingClientRect().top === playground.getBoundingClientRect().bottom) {
// 		snakes[0].style.top = '0px'
// 		position.top = +snake.style.top.slice(0, -2)
// 	} else if (snakes[0].getBoundingClientRect().top + 15 === playground.getBoundingClientRect().top) {
// 		snakes[0].style.top = playground.clientHeight - 15 + 'px'
// 		position.top = +snake.style.top.slice(0, -2)
// 	}
// }

// snakes[0].style.left = '1200px'
const checkPosition = () => {
	if (+snake.style.left.slice(0, -2) === size.width) {
		snakes[0].style.left = `0px`
		position.left = +snake.style.left.slice(0, -2)
		check.translated = true
		check.direction = -direction
	} else if (snakes[0].style.left === '-15px') {
		snakes[0].style.left = playground.scrollWidth - 15 + 'px'
		position.left = +snake.style.left.slice(0, -2)
		check.translated = true
		check.direction = -direction
	} else if (+snake.style.top.slice(0, -2) === playground.clientHeight) {
		snakes[0].style.top = '0px'
		position.top = +snake.style.top.slice(0, -2)
		check.translated = true
		check.direction = -direction
	} else if (snakes[0].style.top === '-15px') {
		snakes[0].style.top = playground.clientHeight - 15 + 'px'
		position.top = +snake.style.top.slice(0, -2)
		check.translated = true
		check.direction = -direction
	} else {
		check.translated = false
	}
}

const steer = e => {
	dirCheck(e)
	interval = setInterval(() => {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			movementHorizontal()
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			movementVertical()
		}
		checkPosition()

		if (snakes[0].style.top === apple.style.top && snakes[0].style.left === apple.style.left) {
			grow()
			if (score === 0) {
				win()
			}
		}

		for (let i = snakes.length - 1; i > 1; i--) {
			if (snakes[i].style.left === snakes[0].style.left && snakes[i].style.top === snakes[0].style.top) {
				defeat()
			}
		}
	}, 50)
}

const resizeWidth = () => {
	size.width = 0
	while (size.width < window.innerWidth - 60) {
		size.width += 15
	}
	if (size.width % 10) {
		size.width -= 15
	}

	playground.style.width = `${size.width}px`
}

const resizeHeight = () => {
	size.height = 0
	while (size.height < window.innerHeight - 75) {
		size.height += 15
	}

	if (size.height % 10) {
		size.height -= 15
	}

	playground.style.height = `${size.height}px`
}

const resize = () => {
	if (window.innerWidth < 1260) {
		resizeWidth()
		restart()
	} else {
		size.width = 1200
		playground.style.width = `${size.width}px`
		restart()
	}
	if (window.innerHeight <= 720) {
		resizeHeight()
		restart()
	} else {
		size.height = 660
		playground.style.height = `${size.height}px`
		restart()
	}
}

const restart = () => {
	for (let i = snakes.length - 1; i > 0; i--) {
		snakes[i].remove()
		snakes.pop()
	}
	btn.classList.remove('active')
	h1.classList.remove('win')
	h1.classList.remove('lost')
	h1.classList.add('active')
	if (size.width < 540) {
		h1.textContent = 'use 🏹'
	} else {
		h1.textContent = 'navigate with arrows'
	}
	direction = ''
	lost = 0
	range = 180
	h = range
	rangeFlipper = 0
	score = difficulty
	hasStarted = 0
	span.textContent = score
	span.style.color = 'hsl(179, 100%, 55%)'
	apple.style.top = Math.floor(Math.random() * (size.height / 15)) * 15 + 'px'
	apple.style.left = Math.floor(Math.random() * (size.width / 15)) * 15 + 'px'
	snake.style.top = `${size.height / 2 - 15}px`
	snake.style.left = `${size.width / 2 - 15}px`
	snake.style.backgroundColor = '#fff'
	position.top = +snake.style.top.slice(0, -2)
	position.left = +snake.style.left.slice(0, -2)
	apple.style.display = 'block'
}
resize()

document.addEventListener('keydown', e => {
	if (lost === 0 && e.key.includes('Arrow') && isReady) {
		// clearInterval(interval)
		isReady = false
		steer(e)
	}
})

window.addEventListener('resize', resize)

btn.addEventListener('click', restart)
