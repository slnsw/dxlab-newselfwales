import { Component } from 'react';
import { Subscription } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

class TransceiverContainer extends Component {
	static propTypes = {
		channel: PropTypes.string,
		onReceive: PropTypes.func,
	};

	render() {
		const { channel, onReceive } = this.props;

		return (
			<div className="transceiver-container">
				<Subscription
					subscription={TRANSCEIVER_SUBSCRIPTION}
					variables={{ channelSlug: channel }}
				>
					{({ data, loading }) => {
						if (loading) {
							return null;
						}

						const { id, value } = data.onSendControl;

						return <Transceiver id={id} value={value} onReceive={onReceive} />;
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
		value: PropTypes.string,
		onReceive: PropTypes.func,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.id !== this.props.id) {
			this.handleReceive(this.props.value);
		}
	}

	handleReceive(value) {
		if (typeof this.props.onReceive === 'function') {
			this.props.onReceive(value);
		}
	}

	render() {
		return null;
	}
}

export default TransceiverContainer;

const TRANSCEIVER_SUBSCRIPTION = gql`
	subscription sendControl($channelSlug: String!) {
		onSendControl(channelSlug: $channelSlug) {
			id
			value
		}
	}
`;
