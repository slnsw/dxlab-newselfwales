import { Component } from 'react';
import { Subscription } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

class TransceiverContainer extends Component {
	static propTypes = {
		appId: PropTypes.string.isRequired,
		channel: PropTypes.string.isRequired,
		onReceive: PropTypes.func,
	};

	componentDidMount() {
		console.log('Transceiver subscribed to messages', this.props.channel);
	}

	render() {
		const { appId, channel, onReceive } = this.props;

		return (
			<div className="transceiver-container">
				<Subscription
					subscription={TRANSCEIVER_SUBSCRIPTION}
					variables={{ appId, channel }}
				>
					{({ data, loading }) => {
						if (loading) {
							return null;
						}

						const { id, action, value } = data.onSendControl;

						return (
							<Transceiver
								id={id}
								message={{
									action,
									value,
								}}
								onReceive={onReceive}
							/>
						);
					}}
				</Subscription>
				<span />
			</div>
		);
	}
}

class Transceiver extends Component {
	static propTypes = {
		id: PropTypes.string,
		message: PropTypes.shape({
			action: PropTypes.string,
			value: PropTypes.string,
		}),
		onReceive: PropTypes.func,
	};

	componentDidMount() {
		this.handleReceive(this.props.message);
	}

	componentDidUpdate(prevProps) {
		console.log(this.props);

		if (prevProps.id !== this.props.id) {
			this.handleReceive(this.props.message);
		}
	}

	handleReceive(message) {
		if (typeof this.props.onReceive === 'function') {
			this.props.onReceive(message);
		}
	}

	render() {
		return null;
	}
}

export default TransceiverContainer;

const TRANSCEIVER_SUBSCRIPTION = gql`
	subscription sendControl($appId: String!, $channel: String!) {
		onSendControl(appId: $appId, channel: $channel) {
			id
			action
			value
		}
	}
`;
