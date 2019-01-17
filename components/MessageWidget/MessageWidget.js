import { Component } from 'react';
import PropTypes from 'prop-types';

import './MessageWidget.css';

class MessageWidget extends Component {
	static propTypes = {
		messages: PropTypes.array,
		timePerMessage: PropTypes.number, // in milliseconds
	};

	state = {
		message: '',
		messageIndex: 0,
	};

	componentDidMount() {
		this.init();
	}

	componentWillUnmount() {
		clearTimeout(this.messageTimeoutObj);
	}

	init = () => {
		this.setState(
			{
				message: this.props.messages[this.state.messageIndex],
			},
			() => {
				this.startTimeout();
			},
		);
	};

	nextMessage = () => {
		const m =
			this.state.messageIndex + 1 === this.props.messages.length
				? 0
				: this.state.messageIndex + 1;
		this.setState(
			{
				message: this.props.messages[m],
				messageIndex: m,
			},
			this.startTimeout(),
		);
	};

	startTimeout = () => {
		this.messageTimeoutObj = setTimeout(() => {
			this.nextMessage();
		}, this.props.timePerMessage);
	};

	render() {
		return (
			<div className="message-widget">
				<span dangerouslySetInnerHTML={{ __html: this.state.message }} />
			</div>
		);
	}
}

export default MessageWidget;
