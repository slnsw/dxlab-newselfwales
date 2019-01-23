import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import Link from '../Link';
import './ImageModal.css';
import Modal from '../Modal';
import LoaderText from '../LoaderText';
import { SCREEN_SM } from '../../styles/variables';

const typeName = {
	portrait: 'State Library of NSW Collection',
	'instagram-selfie': 'Instagram Selfie',
	'gallery-selfie': 'Gallery Selfie',
};

class ImageModal extends Component {
	static propTypes = {
		title: PropTypes.string,
		primoId: PropTypes.string,
		shortcode: PropTypes.string,
		imageUrl: PropTypes.string,
		content: PropTypes.string,
		imageType: PropTypes.string,
		sourceImageBoundingClientRect: PropTypes.object,
		onClose: PropTypes.func,
		isActive: PropTypes.bool,
		isLoading: PropTypes.bool,
		date: PropTypes.string,
		instagramUsername: PropTypes.string,
		flNumber: PropTypes.string,
	};

	state = {
		screenWidth: null,
		screenHeight: null,
	};

	componentDidMount() {
		// TODO: Update on resize
		this.setState({
			// screenWidth: window.innerWidth,
			// screenHeight: window.innerHeight,
			screenWidth: document.documentElement.clientWidth,
			screenHeight: document.documentElement.clientHeight,
		});
	}

	handleClose = () => {
		this.props.onClose();
	};

	splitNotBetween = (s, d, ll, rl) => {
		// splits the string s by delimter character d, but not between
		// the characters ll and rl. LD Dec 2018
		const a = [];
		let p = 0;
		let b = '';
		let inside = false;
		for (let i = 0; i < s.length; i++) {
			const l = s.charAt(i);
			if (inside) {
				if (l === rl) {
					inside = false;
					b += l;
				} else {
					b += l;
				}
			} else if (l === ll) {
				inside = true;
				b += l;
			} else if (l === d) {
				a[p] = b;
				b = '';
				p += 1;
			} else {
				b += l;
			}
			if (i === s.length - 1) {
				a[p] = b;
				b = '';
				p += 1;
			}
		}
		return a;
	};

	findEndOfHashtag = (s) => {
		// returns an array - first element is the hashtag (which may be the only thing in s)
		// second element is any text after it (or an empty strimg if no match)
		const p = s.search(/[^A-Za-z0-9_]/);
		let s1;
		let s2;
		if (p === -1) {
			// handle no match
			s1 = s;
			s2 = '';
		} else {
			s1 = s.substr(0, p);
			s2 = s.substr(p);
		}
		return [s1, s2];
	};

	parseContent = (desc1, type) => {
		// function wraps search hyperlinks round hash tags or
		// subject terms in the submitted string.
		let desc;
		if (desc1 && desc1.trim()) {
			// so we definitely have a string to parse.
			// Remove enclosing <p> tags:
			desc = desc1.trim();
			if (desc.substring(0, 3) === '<p>') {
				desc = desc.substring(3);
			}
			if (desc.substring(desc.length - 4) === '</p>') {
				desc = desc.substring(0, desc.length - 4);
			}
			// deal with portraits
			if (type === 'portrait') {
				// The desc for protraits is a comma sep list of subjetcts.
				// split them up by commas, but avoid commas inside parentheses.
				const bits = this.splitNotBetween(desc, ',', '(', ')');
				const out = [];
				if (bits.length > 1) {
					for (let i = 0; i < bits.length; i++) {
						if (bits[i].trim()) {
							out[i] = {
								url: `/newselfwales/search?q=${bits[i].trim()}`,
								linkText: `#${bits[i].trim()}`,
								postText: `, `,
							};
						}
					}
					out[bits.length - 1].postText = '';
				} else {
					out[0] = {
						url: `/newselfwales/search?q=${bits[0].trim()}`,
						linkText: `#${bits[0].trim()}`,
						postText: ``,
					};
				}
				return out;
			}
			// deal with Instagram
			if (type === 'instagram-selfie') {
				// split up by Hashtag symbol, but avoid ones in &#160; and its friends
				const bits = this.splitNotBetween(desc, '#', '&', ';');
				const out = [];
				out[0] = { url: null, linkText: null, postText: bits[0] };
				if (bits.length > 1) {
					for (let i = 1; i < bits.length; i++) {
						const t = this.findEndOfHashtag(bits[i]);
						out[i] = {
							url: `/newselfwales/search?q=${t[0]}`,
							linkText: `#${t[0]}`,
							postText: ` ${t[1]}`,
						};
					}
				}
				return out;
			}
		}
		return desc;
	};

	render() {
		const {
			title,
			primoId,
			shortcode,
			imageUrl,
			content,
			imageType,
			sourceImageBoundingClientRect,
			isActive,
			date,
			instagramUsername,
			flNumber,
			isLoading,
		} = this.props;

		const { screenWidth } = this.state;

		const timeout = 500;

		let dateString;

		if (date) {
			const d = new Date(date);
			dateString = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
		}

		const collectionLink = flNumber
			? `http://digital.sl.nsw.gov.au/delivery/DeliveryManagerServlet?embedded=true&toolbar=false&dps_pid=${flNumber.toUpperCase()}`
			: primoId &&
				`https://search.sl.nsw.gov.au/primo-explore/fulldisplay?vid=SLNSW&search_scope=EEA&adaptor=Local%20Search%20Engine&docid=${primoId.toUpperCase()}`;

		return (
			<Transition
				in={isActive}
				timeout={timeout}
				appear={true}
				// unmountOnExit={true}
			>
				{(state) => {
					// if (isLoading) {
					// 	return null;
					// }

					const defaultStyle = {
						transition: `all ${timeout}ms cubic-bezier(0.86, 0, 0.07, 1)`,
						opacity: 1,
						top:
							sourceImageBoundingClientRect &&
							sourceImageBoundingClientRect.y +
								sourceImageBoundingClientRect.height / 2,
						left:
							sourceImageBoundingClientRect &&
							sourceImageBoundingClientRect.x +
								sourceImageBoundingClientRect.width / 2,
						width:
							sourceImageBoundingClientRect &&
							sourceImageBoundingClientRect.width,
						height:
							sourceImageBoundingClientRect &&
							sourceImageBoundingClientRect.height,
					};

					const transitionStyles = {
						entering: {
							opacity: 1,
							// top: screenHeight / 2,
							// left: screenWidth / 2,
							top: '50%',
							left: '50%',
							height: screenWidth > SCREEN_SM ? '80%' : 'calc(100% - 2em)',
							width: screenWidth > SCREEN_SM ? '80%' : 'calc(100% - 0.91em)',
						},
					};

					// console.log(screenWidth);
					console.log(this.parseContent(content, imageType));

					return (
						<Modal
							className={`image-modal image-modal--${state}`}
							isActive={isActive}
							onClose={this.handleClose}
							style={{
								...defaultStyle,
								...(screenWidth && (state === 'entering' || state === 'entered')
									? transitionStyles.entering
									: {}),
							}}
						>
							<div className="image-modal__image-holder">
								{shortcode ? (
									<a href={`https://www.instagram.com/p/${shortcode}`}>
										<div
											className="image-modal__image"
											style={{
												backgroundImage: `url(${imageUrl})`,
											}}
										/>
									</a>
								) : (
									<div
										className="image-modal__image"
										style={{
											backgroundImage: `url(${imageUrl})`,
										}}
									>
										{/* <img
										className="image-modal__image"
										src={imageUrl}
										alt={title}
										width="100%"
										height="auto"
									/> */}
									</div>
								)}
							</div>

							<div className="image-modal__info">
								{isLoading && <LoaderText />}

								<div className="image-modal__type">{typeName[imageType]}</div>

								<h1
									className="image-modal__title"
									dangerouslySetInnerHTML={{ __html: title }}
								/>
								<div className="image-modal__content">
									<p>
										{content &&
											this.parseContent(content, imageType).map((item) => {
												return (
													<Fragment>
														{item.url && (
															<Link to={item.url}>
																<a
																	dangerouslySetInnerHTML={{
																		__html: item.linkText,
																	}}
																/>
															</Link>
														)}
														<span
															dangerouslySetInnerHTML={{
																__html: item.postText,
															}}
														/>
													</Fragment>
												);
											})}
									</p>
								</div>
							</div>
							<footer className="image-modal__footer">
								{instagramUsername && (
									<a
										className="image-modal__instagram-username"
										target="_blank"
										href={`https://www.instagram.com/${instagramUsername}`}
									>
										@{instagramUsername}
									</a>
								)}

								{dateString && (
									<div className="image-modal__date">{dateString}</div>
								)}

								{collectionLink && (
									<a
										className="image-modal__collection-link"
										target="_blank"
										href={collectionLink}
									>
										Collection Image
									</a>
								)}
							</footer>
						</Modal>
					);
				}}
			</Transition>
		);
	}
}

export default ImageModal;
