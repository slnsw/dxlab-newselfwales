export const idleTimer = {
	init(resetDelay = 15) {
		this.resetDelay = resetDelay;
	},

	start(onUserIdle) {
		this.onUserIdle = onUserIdle;
		if (!this.timeout) {
			this.timeout = setTimeout(
				this.whenUserIdle.bind(this),
				this.resetDelay * 1000,
			);
			this.resetFunc = this.reset.bind(this);
			window.addEventListener('mousemove', this.resetFunc);
			window.addEventListener('keydown', this.resetFunc);
			window.addEventListener('click', this.resetFunc);
			// console.log('Idle timer started.');
		}
	},

	stop() {
		if (this.timeout) {
			// console.log('Idle timer ' + this.timeout + ' stopped.');
			// cancel event listeners
			window.removeEventListener('mousemove', this.resetFunc);
			window.removeEventListener('keydown', this.resetFunc);
			window.removeEventListener('click', this.resetFunc);
			// stop the timeout
			clearTimeout(this.timeout);
			this.timeout = false;
			console.log(this.timeout);
		}
	},

	reset() {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(
			this.whenUserIdle.bind(this),
			this.resetDelay * 1000,
		);
		// console.log('Idle timer reset by keypress/click/mousemove ' + this.timeout);
	},

	whenUserIdle() {
		// console.log('user idle! Reloading!!!');
		// cancel event listeners
		window.removeEventListener('mousemove', this.resetFunc);
		window.removeEventListener('keydown', this.resetFunc);
		window.removeEventListener('click', this.resetFunc);
		// got to onUserIdle callback
		this.timeout = false;
		if (typeof this.onUserIdle === 'function') {
			this.onUserIdle();
		}
	},
};
