import { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Page from '../Page';

class PageContainer extends Component {
	static propTypes = {
		title: PropTypes.string,
		slug: PropTypes.string,
	};

	state = {
		isMounted: false,
	};

	componentDidMount() {
		this.setState({
			isMounted: true,
		});
	}

	componentWillUnmount() {
		this.setState({
			isMounted: false,
		});
	}

	render() {
		const { title, slug } = this.props;
		const { isMounted } = this.state;

		return (
			<Query
				query={gql`
					query getPage($slug: String) {
						pages(slug: $slug) {
							title
							slug
							content
						}
					}
				`}
				variables={{
					slug,
				}}
			>
				{({ loading, error, data }) => {
					if (loading || !data.pages[0]) {
						return null;
					}

					if (error) {
						console.log(error);
						return null;
					}

					const { content } = data.pages[0];

					return (
						<Page
							title={title}
							slug={slug}
							content={content}
							isMounted={isMounted}
						/>
					);
				}}
			</Query>
		);
	}
}

export default PageContainer;
