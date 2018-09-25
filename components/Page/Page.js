import { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import './Page.css';

class Page extends Component {
	static propTypes = {
		content: PropTypes.string,
	};

	render() {
		const { title, content, isMounted } = this.props;

		return (
			<CSSTransition
				in={isMounted}
				timeout={300}
				unmountOnExit={true}
				appear={true}
				classNames="page-"
			>
				<div className="page">
					<article>
						<h1>{title}</h1>

						<div
							className="page__content"
							dangerouslySetInnerHTML={{ __html: content }}
						/>
					</article>
				</div>
			</CSSTransition>
		);
	}
}

export default Page;
