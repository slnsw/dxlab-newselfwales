import { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './ImageModalContainer.css';
import ImageModal from '../ImageModal';

class ImageModalContainer extends Component {
	static propTypes = {
		id: PropTypes.number.isRequired,
		imageType: PropTypes.string.isRequired,
		onClose: PropTypes.func,
	};

	render() {
		const { id, imageType, onClose } = this.props;

		return (
			<Query
				query={gql`
					query getImage($id: Int) {
						newSelfWales {
							portrait(id: $id) {
								title
							}
						}
					}
				`}
				variables={{
					id,
				}}
			>
				{({ data, loading, error }) => {
					return (
						<ImageModal
							title={data.newSelfWales && data.newSelfWales.portrait.title}
							loading={loading}
							error={error}
							onClose={onClose}
						/>
					);
				}}
			</Query>
		);
	}
}

export default ImageModalContainer;
