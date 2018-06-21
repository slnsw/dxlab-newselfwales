import { Component, Fragment } from 'react';
import { Query, Subscription } from 'react-apollo';
import gql from 'graphql-tag';
// import PropTypes from 'prop-types';

import './TestFeed.css';

class TestFeed extends Component {
	// static propTypes = {};

	render() {
		// const {} = this.props;

		return (
			<Fragment>
				<Query
					query={gql`
						{
							posts {
								title
							}
						}
					`}
				>
					{({ loading, error, data }) => {
						console.log('Query');
						console.log(loading, error, data);
						return (
							<div className="test-feed">
								<span />
							</div>
						);
					}}
				</Query>

				<Subscription
					subscription={gql`
						subscription {
							onSendControl(channelSlug: "TEST") {
								id
								value
							}
						}
					`}
				>
					{({ data, loading, error }) => {
						console.log('Subscription');
						console.log(data, error, loading);
						return <p />;
					}}
				</Subscription>
			</Fragment>
		);
	}
}

export default TestFeed;
