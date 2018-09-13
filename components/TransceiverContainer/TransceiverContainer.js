import { Component } from 'react';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';
// import PropTypes from 'prop-types';

class TransceiverContainer extends Component {
	// static propTypes = {};

	render() {
		// const {} = this.props;

		return (
			<div className="transceiver-container">
				<Subscription
					subscription={gql`
						subscription {
							onSendControl(channelSlug: "NEWSELFWALES") {
								id
								value
							}
						}
					`}
				>
					{({ data, loading }) => {
						console.log(data, loading);

						return <p>test</p>;
					}}
				</Subscription>
				<span />
			</div>
		);
	}
}

export default TransceiverContainer;

// const TRANSCEIVER_SUBSCRIPTION = gql`
// 	subscription sendControl($channelSlug: String!) {
// 		onSendControl(channelSlug: $channelSlug) {
// 			id
// 			value
// 		}
// 	}
// `;

// const TRANSCEIVER_SUBSCRIPTION = gql`
// 	subscription {
// 		onSendControl(channelSlug: "UNPACKED") {
// 			id
// 			value
// 		}
// 	}
// `;
