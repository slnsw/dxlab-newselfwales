import { Component, Fragment } from 'react';
import { Query, Subscription, graphql } from 'react-apollo';
import gql from 'graphql-tag';
// import PropTypes from 'prop-types';

import './TestFeed.css';

class TestFeed extends Component {
	// static propTypes = {};

	render() {
		// const {} = this.props;
		// console.log(this.props);

		return (
			<Fragment>
				<p>test</p>
				{/* <Query
					ssr={true}
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
								<span />Hi
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
				</Subscription> */}
			</Fragment>
		);
	}
}

export default graphql(
	gql`
		{
			posts {
				title
			}
		}
	`,
	{
		props: ({ data }) => {
			console.log(data);

			return {
				...data,
			};
		},
	},
)(TestFeed);
