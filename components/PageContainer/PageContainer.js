import { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { CSSTransition } from 'react-transition-group';

// import PropTypes from 'prop-types';

import './PageContainer.css';

class PageContainer extends Component {
	// static propTypes = {};

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
					if (loading) {
						return null;
					}

					if (error) {
						console.log(error);
						return null;
					}

					const { content } = data.pages[0];

					return (
						<CSSTransition
							in={isMounted}
							timeout={600}
							unmountOnExit={true}
							appear={true}
							classNames="page-container-"
						>
							<div className="page-container">
								<article>
									<h1>{title}</h1>

									<div
										className="page-container__content"
										dangerouslySetInnerHTML={{ __html: content }}
									/>
								</article>
							</div>
						</CSSTransition>
					);
				}}
			</Query>
		);
	}
}

export default PageContainer;
