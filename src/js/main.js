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

const getTranslate = (el, axis) => {
	switch (axis) {
		case 'x':
			return +el.style.transform.split('(')[1].slice(0, -1).split(',')[0].slice(0, -2)
		case 'y':
			return +el.style.transform.split('(')[1].slice(0, -1).split(',')[1].slice(0, -2)
	}
}

const check = {
	direction: 0,
	translated: false,
}

const size = {
	width: 1200,
	height: 660,
}

span.textContent = score
apple.style.transform = `translate(${Math.floor(Math.random() * (size.width / 15)) * 15}px, ${Math.floor(Math.random() * (size.height / 15)) * 15}px)`
snake.style.transform = `translate(${size.width / 2 - 15}px, ${size.height / 2 - 15}px)`

const position = {
	x: getTranslate(snake, 'x'),
	y: getTranslate(snake, 'y'),
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
	snakeEl.style.transform = snakes[snakes.length - 1].style.transform
	setColor(snakeEl)

	playground.append(snakeEl)
	snakes.push(snakeEl)
}

const grow = () => {
	if (snakes.length === 1) {
		snakes[0].style.backgroundColor = `hsl(${h}, 80%, 50%)`
	}
	apple.style.transform = `translate(${Math.floor(Math.random() * (size.width / 15)) * 15}px, ${Math.floor(Math.random() * (size.height / 15)) * 15}px)`
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

const movementVertical = () => {
	if (snakes.length > 1) {
		if (
			position.y + 15 * direction === getTranslate(snakes[1], 'y') ||
			(check.translated && check.direction === direction)
		) {
			direction *= -1
		}
		for (let i = snakes.length - 1; i > 0; i--) {
			snakes[i].style.transform = snakes[i - 1].style.transform
		}
	}
	position.y += 15 * direction
	snakes[0].style.transform = `translate(${position.x}px, ${position.y}px)`

	isReady = true
}
const movementHorizontal = () => {
	if (snakes.length > 1) {
		if (
			position.x + 15 * direction === getTranslate(snakes[1], 'x') ||
			(check.translated && check.direction === direction)
		) {
			direction *= -1
		}
		for (let i = snakes.length - 1; i > 0; i--) {
			snakes[i].style.transform = snakes[i - 1].style.transform
		}
	}
	position.x += 15 * direction
	snakes[0].style.transform = `translate(${position.x}px, ${position.y}px)`

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

const checkPosition = () => {
	if (getTranslate(snake, 'x') === size.width) {
		position.x = 0
		snakes[0].style.transform = `translate(${position.x}px, ${position.y}px)`
		check.translated = true
		check.direction = -direction
	} else if (getTranslate(snake, 'x') === -15) {
		position.x = playground.scrollWidth - 15
		snakes[0].style.transform = `translate(${position.x}px, ${position.y}px)`
		check.translated = true
		check.direction = -direction
	} else if (getTranslate(snake, 'y') === playground.clientHeight) {
		position.y = 0
		snakes[0].style.transform = `translate(${position.x}px, ${position.y}px)`
		check.translated = true
		check.direction = -direction
	} else if (getTranslate(snake, 'y') === -15) {
		position.y = playground.clientHeight - 15
		snakes[0].style.transform = `translate(${position.x}px, ${position.y}px)`
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

		if (snakes[0].style.transform === apple.style.transform) {
			grow()
			if (score === 0) {
				win()
			}
		}

		for (let i = snakes.length - 1; i > 1; i--) {
			if (snakes[i].style.transform === snakes[0].style.transform) {
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
	apple.style.transform = `translate(${Math.floor(Math.random() * (size.width / 15)) * 15}px, ${Math.floor(Math.random() * (size.height / 15)) * 15}px)`
	snake.style.transform = `translate(${size.width / 2 - 15}px, ${size.height / 2 - 15}px)`
	snake.style.backgroundColor = '#fff'
	position.x = getTranslate(snake, 'x')
	position.y = getTranslate(snake, 'y')
	apple.style.display = 'block'
}
resize()

document.addEventListener('keydown', e => {
	if (lost === 0 && e.key.includes('Arrow') && isReady) {
		isReady = false
		steer(e)
	}
})

window.addEventListener('resize', resize)

btn.addEventListener('click', restart)
