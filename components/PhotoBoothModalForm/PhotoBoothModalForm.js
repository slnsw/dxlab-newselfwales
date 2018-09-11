import { Component } from 'react';
import PropTypes from 'prop-types';
import WPAPI from 'wpapi';

import './PhotoBoothModalForm.css';

class PhotoBoothModalForm extends Component {
	static propTypes = {
		onQuitClick: PropTypes.func,
		onFormSubmitComplete: PropTypes.func,
		onInputTextFocus: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			interests: '',
			email: '',
			name: '',
			'terms-conditions': false,
			isFormSending: false,
			formErrors: { interests: '', email: '', 'terms-conditions': '' },
			interestsValid: false,
			emailValid: false,
			termsConditionsValid: false,
			formValid: false,
		};
	}

	componentDidMount() {
		// Set up Wordpress API
		this.wp = new WPAPI({
			endpoint: process.env.WP_API_ENDPOINT,
			username: process.env.WP_USERNAME,
			password: process.env.WP_PASSWORD,
		});
		this.wp.gallerySelfies = this.wp.registerRoute(
			'wp/v2',
			'/gallery-selfies/(?P<id>\\d+)',
		);
	}

	handleUserInput = (e) => {
		const { target } = e;
		const { name } = target;
		const value = target.type === 'checkbox' ? target.checked : target.value;

		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	};

	validateField(fieldName, value) {
		const formErrors = {
			...this.state.formErrors,
		};

		let {
			// interestsValid,
			emailValid,
			termsConditionsValid,
		} = this.state;

		switch (fieldName) {
			case 'email': {
				if (value.length > 0) {
					emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				} else {
					// no email is a valid email
					emailValid = true;
				}
				formErrors.email = emailValid ? '' : 'Please enter a valid email.';
				break;
			}
			// case 'interests': {
			// 	const t = value
			// 		.split(',') // separate interests by comma
			// 		.filter((entry) => entry.trim() !== '')
			// 		.filter(
			// 			// rdon't count blank ones
			// 			(entry) => entry.trim().length >= 3,
			// 		); // make sure they aren't too short

			// 	interestsValid = t.length > 2; // and make sure we have at least 3
			// 	formErrors.interests = interestsValid
			// 		? ''
			// 		: 'Could you enter a bit more info about your interests? Ideally 4 or 5, separated by commas.';
			// 	break;
			// }
			case 'terms-conditions': {
				termsConditionsValid = value;
				formErrors['terms-conditions'] = termsConditionsValid
					? ''
					: 'Please agree to the terms and conditions to continue.';
				break;
			}
			default:
				break;
		}

		this.setState(
			{
				formErrors,
				emailValid,
				// interestsValid,
				termsConditionsValid,
			},
			this.validateForm,
		);
	}

	validateForm() {
		this.setState({
			formValid:
				this.state.emailValid &&
				// this.state.interestsValid &&
				this.state.termsConditionsValid,
		});
	}

	handleSubmitForm = () => {
		this.setState({
			isFormSending: true,
		});

		const date = new Date();
		const selfieTitle = `selfie ${date.getTime()}`;

		// now create custom post type 'gallery selfie'
		this.wp
			.gallerySelfies()
			.create({
				title: `New post ${selfieTitle}`,
				content: this.state.interests,
				status: 'draft',
				meta: {
					email: this.state.email, // TODO: Hide email in API?
					name: this.state.name,
				},
			})
			.then((response) => {
				const newPost = response.id;

				this.wp
					.media()
					.file(this.props.blob, `${selfieTitle}.png`)
					.create({
						title: selfieTitle,
						alt_text: selfieTitle,
						caption: selfieTitle,
						description: selfieTitle,
					})
					.then((mediaResponse) => {
						const newImageId = mediaResponse.id;
						return this.wp
							.gallerySelfies()
							.id(newPost)
							.update({
								featured_media: newImageId,
							});
					})
					.then(() => {
						this.setState({
							isFormSending: false,
						});

						if (typeof this.props.onFormSubmitComplete === 'function') {
							this.props.onFormSubmitComplete();
						}
					})
					.catch((error) => {
						this.setState({
							isFormSending: false,
						});

						console.log(error);
					});
			})
			.catch((error) => {
				this.setState({
					isFormSending: false,
				});

				console.log(error);
			});
	};

	handleQuitButton = () => {
		if (typeof this.props.onQuitClick === 'function') {
			this.props.onQuitClick();
		}
	};

	handleInputFocus = (input) => {
		if (typeof this.props.onInputTextFocus === 'function') {
			this.props.onInputTextFocus(input);
		}
		// this.setState({ inputNode: input });
	};

	handleNameInput = (event) => {
		this.setState({
			name: event.target.value,
		});
	};

	handleEmailInput = (event) => {
		this.setState({
			email: event.target.value,
		});
	};

	handleInterestsInput = (event) => {
		this.setState({
			interests: event.target.value,
		});
	};

	handleTermsConditionsClick = (event) => {
		this.setState({
			termsConditionsValid: event.target.checked,
		});
	};

	render() {
		const { formErrors, formValid } = this.state;

		return (
			<div className="photo-booth-modal-form">
				<h1>Your Details</h1>
				<p>
					If you are happy with this photo, please fill in the form and press
					submit. Your photo will then appear in the gallery.
				</p>

				<p>
					<label className="photo-booth-modal-form__label" htmlFor="name">
						Name:
					</label>
					<input
						type="text"
						name="name"
						id="name"
						value={this.state.name}
						placeholder="Your name"
						onFocus={() => this.handleInputFocus(this.nameInput)}
						onChange={(event) => this.handleUserInput(event)}
						onInput={this.handleNameInput}
						ref={(input) => {
							this.nameInput = input;
						}}
					/>
				</p>

				<p>
					<label className="photo-booth-modal-form__label" htmlFor="email">
						Email:
					</label>
					<input
						// NOTE: Would prefer 'email', but react-screen-keyboard doesn't work
						type="text"
						name="email"
						id="email"
						value={this.state.email}
						placeholder="Your email address"
						onFocus={() => this.handleInputFocus(this.emailInput)}
						onBlur={(event) => this.handleUserInput(event)}
						onInput={this.handleEmailInput}
						ref={(input) => {
							this.emailInput = input;
						}}
					/>
				</p>

				{/* <p>
					Please tell us a few things about yourself so we can match you to a
					portrait from our collection.
				</p>
				<p>
					<label className="photo-booth-modal-form__label" htmlFor="interests">
						Your interests:
					</label>
					<input
						type="text"
						name="interests"
						id="interests"
						value={this.state.interests}
						placeholder="Enter around 4 or 5, separated by commas"
						onFocus={() => this.handleInputFocus(this.interestsInput)}
						onBlur={(event) => this.handleUserInput(event)}
						onInput={this.handleInterestsInput}
						ref={(input) => {
							this.interestsInput = input;
						}}
					/>
				</p> */}

				<div className="photo-booth-modal-form__terms-conditions">
					<div className="photo-booth-modal-form__terms-conditions__input">
						<label className="checkbox photo-booth-modal-form__checkbox">
							<input
								type="checkbox"
								name="terms-conditions"
								id="terms-conditions"
								checked={this.state['terms-conditions']}
								// onClick={this.handleTermsConditionsClick}
								onChange={(event) => this.handleUserInput(event)}
							/>{' '}
							<span className="checkbox__checkmark" />
						</label>
						<label htmlFor="terms-conditions">
							I agree to the following terms and conditions:
						</label>
					</div>

					<p>
						By submitting your photo from this photobooth, you are allowing the
						State Library of NSW to collect, store and show your image as part
						of this digital experience and online, including promotion.
					</p>
				</div>

				<div className="photo-booth-modal-form__footer">
					<button
						className="button"
						onClick={this.handleSubmitForm}
						onChange={(event) => this.handleUserInput(event)}
						disabled={formValid !== true || this.state.isFormSending}
					>
						Submit
					</button>
					&nbsp;&nbsp;&nbsp;
					<button
						className="button button--dark"
						onClick={this.handleQuitButton}
					>
						Quit
					</button>
					{(formErrors.name ||
						formErrors.email ||
						formErrors.interests ||
						formErrors['terms-conditions']) && (
						<span className="photo-booth-modal-form__form-error-message">
							{formErrors.name ||
								formErrors.email ||
								formErrors.interests ||
								formErrors['terms-conditions']}
						</span>
					)}
				</div>
			</div>
		);
	}
}

export default PhotoBoothModalForm;
