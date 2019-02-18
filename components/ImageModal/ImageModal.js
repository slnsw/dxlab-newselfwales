import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import Head from 'next/head';
import { AllHtmlEntities } from 'html-entities';

import Link from '../Link';
import Image from '../Image';
import ShareBox from '../ShareBox';
import Modal from '../Modal';
import LoaderText from '../LoaderText';
import { SCREEN_SM } from '../../styles/variables';
import './ImageModal.css';

const typeName = {
	portrait: 'State Library of NSW Collection',
	'instagram-selfie': 'Instagram Selfie',
	'gallery-selfie': 'Gallery Selfie',
};

class ImageModal extends Component {
	static propTypes = {
		id: PropTypes.number,
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
		dateText: PropTypes.string,
		timestamp: PropTypes.number,
		instagramUsername: PropTypes.string,
		flNumber: PropTypes.string,
	};

	static defaultProps = {
		content: '',
	};

	state = {
		screenWidth: null,
		screenHeight: null,
		isImageLoaded: false,
	};

	componentDidMount() {
		this.handleResize();

		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize = () => {
		this.setState({
			// screenWidth: window.innerWidth,
			// screenHeight: window.innerHeight,
			screenWidth: document.documentElement.clientWidth,
			screenHeight: document.documentElement.clientHeight,
		});
	};

	handleClose = () => {
		this.props.onClose();
	};

	handleImageLoad = () => {
		this.setState({
			isImageLoaded: true,
		});
	};

	handleTagClick = (tag) => {
		console.log('hiii');

		if (typeof this.props.onTagClick === 'function') {
			this.props.onTagClick(tag);
		}
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
		const entities = new AllHtmlEntities();
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
								url: `/newselfwales/search?q=${entities.encode(
									bits[i].trim(),
								)}`,
								linkText: bits[i].trim(),
								postText: `, `,
							};
						}
					}
					out[bits.length - 1].postText = '';
				} else {
					out[0] = {
						url: `/newselfwales/search?q=${entities.encode(bits[0].trim())}`,
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
							url: `/newselfwales/search?q=${entities.encode(t[0])}`,
							linkText: `#${t[0]}`,
							postText: ` ${t[1]}`,
						};
					}
				}
				return out;
			}
		}
		return [{ url: null, linkText: null, postText: desc }];
	};

	render() {
		const {
			id,
			title,
			primoId,
			shortcode,
			imageUrl,
			content,
			imageType,
			sourceImageBoundingClientRect,
			isActive,
			date,
			dateText,
			timestamp,
			instagramUsername,
			flNumber,
			isLoading,
		} = this.props;

		const { screenWidth, isImageLoaded } = this.state;

		const timeout = 500;

		const pathname = `/newselfwales/${imageType}/${id}`;
		const baseUrl = process.env.BASE_URL || 'https://dxlab.sl.nsw.gov.au';
		const metaUrl = `${baseUrl}${pathname}`;

		let dateString;

		if (dateText && imageType === 'portrait') {
			dateString = dateText;
		}
		if (date && imageType === 'gallery-selfie') {
			const d = new Date(date);
			dateString = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
		}
		if (timestamp && imageType === 'instagram-selfie') {
			const d = new Date(timestamp * 1000);
			dateString = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
		}

		const collectionLink = flNumber
			? `http://digital.sl.nsw.gov.au/delivery/DeliveryManagerServlet?embedded=true&toolbar=false&dps_pid=${flNumber.toUpperCase()}`
			: primoId &&
				`https://search.sl.nsw.gov.au/primo-explore/fulldisplay?vid=SLNSW&search_scope=EEA&adaptor=Local%20Search%20Engine&docid=${primoId.toUpperCase()}`;

		const metaDescription = content.replace(/<p>/g, '').replace(/<\/p>/g, '');

		return (
			<Fragment>
				<Head>
					{title && (
						<title>
							{title} - #NewSelfWales | DX Lab - State Library of NSW
						</title>
					)}
					{title && <meta property="og:title" content={title} />}

					{metaDescription && (
						<meta property="og:description" content={metaDescription} />
					)}
					{metaDescription && (
						<meta name="description" content={metaDescription} />
					)}

					{imageUrl && (
						<meta property="og:image" content={imageUrl} key="meta-image" />
					)}

					{metaUrl && <meta property="og:url" content={metaUrl} />}

					{title && <meta name="twitter:image:alt" content={title} />}
				</Head>

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

						return (
							<Modal
								className={`image-modal image-modal--${state}`}
								isActive={isActive}
								onClose={this.handleClose}
								style={{
									...defaultStyle,
									...(screenWidth &&
									(state === 'entering' || state === 'entered')
										? transitionStyles.entering
										: {}),
								}}
							>
								<div className="image-modal__image-holder">
									{shortcode ? (
										<a href={`https://www.instagram.com/p/${shortcode}`}>
											<div
												className={[
													'image-modal__image',
													isImageLoaded || !process.browser
														? 'image-modal__image--is-loaded'
														: '',
												].join(' ')}
												style={{
													backgroundImage: `url(${imageUrl})`,
												}}
											/>
										</a>
									) : (
										<div
											className={[
												'image-modal__image',
												isImageLoaded || !process.browser
													? 'image-modal__image--is-loaded'
													: '',
											].join(' ')}
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

								{/* Need this to get onLoad event to fire off state change and animate .image-modal__image */}
								<Image
									className="image-modal__hidden-image"
									src={imageUrl}
									onLoad={this.handleImageLoad}
								/>

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
														<Fragment key={item.url}>
															{item.url && (
																<Link to={item.url}>
																	<a
																		dangerouslySetInnerHTML={{
																			__html: item.linkText,
																		}}
																		onClick={() =>
																			this.handleTagClick(item.linkText)
																		}
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

									<ShareBox pathname={pathname} title={title} />
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

									{collectionLink && (
										<a
											className="button button--xs"
											target="_blank"
											href={collectionLink}
										>
											Collection Image
										</a>
									)}

									{dateString && (
										<div className="image-modal__date">{dateString}</div>
									)}
								</footer>
							</Modal>
						);
					}}
				</Transition>
			</Fragment>
		);
	}
}

export default ImageModal;
