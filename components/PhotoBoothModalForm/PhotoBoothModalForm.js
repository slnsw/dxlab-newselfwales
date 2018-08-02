import { Component } from 'react';
import PropTypes from 'prop-types';
import WPAPI from 'wpapi';
import Keyboard from 'react-screen-keyboard';

import './PhotoBoothModalForm.css';

class PhotoBoothModalForm extends Component {
	static propTypes = {
		onQuitClick: PropTypes.func,
		onFormSubmitComplete: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			interests: 'food, candy, money, books, glue',
			email: 'test@test.com',
			name: 'Selfie Test',
			isFormSending: false,
			formErrors: { interests: '', email: '' },
			interestsValid: false,
			emailValid: true,
			formValid: false,
			inputNode: null,
		};
	}

	componentDidMount() {
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
		const { name, value } = e.target;

		// this.setState({
		// 	inputNode: this.input,
		// });

		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	};

	validateField(fieldName, value) {
		const fieldValidationErrors = this.state.formErrors;
		let { interestsValid, emailValid } = this.state;

		switch (fieldName) {
			case 'email': {
				if (value.length > 0) {
					emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				} else {
					// no email is a valid email
					emailValid = true;
				}
				fieldValidationErrors.email = emailValid
					? ''
					: 'Please enter a valid email.';
				break;
			}
			case 'interests': {
				const t = value
					.split(',') // separate interests by comma
					.filter((entry) => entry.trim() !== '')
					.filter(
						// rdon't count blank ones
						(entry) => entry.trim().length >= 4,
					); // make sure they aren't too short

				interestsValid = t.length > 2; // and make sure we have at least 3
				fieldValidationErrors.interests = interestsValid
					? ''
					: 'Could you enter a bit more info about your interests? Ideally 4 or 5, separated by commas.';
				break;
			}
			default:
				break;
		}

		this.setState(
			{
				formErrors: fieldValidationErrors,
				emailValid,
				interestsValid,
			},
			this.validateForm,
		);
	}

	validateForm() {
		this.setState({
			formValid: this.state.emailValid && this.state.interestsValid,
		});
	}

	handleSubmitForm = () => {
		this.setState({
			isFormSending: true,
		});

		const date = new Date();
		const n = `selfie ${date.getTime()}`;

		// now create custom post type 'gallery selfie'
		this.wp
			.gallerySelfies()
			.create({
				title: `New post ${n}`,
				content: `Content ${n}`,
				status: 'draft',
				meta: {
					email: 'some@email.com',
					name: 'test-test_some name',
				},
			})
			.then((response) => {
				const newPost = response.id;

				this.wp
					.media()
					.file(this.props.blob, `${n}.png`)
					.create({
						title: n,
						alt_text: n,
						caption: n,
						description: n,
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
						console.log(error);
					});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	handleQuitButton = () => {
		if (typeof this.props.onQuitClick === 'function') {
			this.props.onQuitClick();
		}
	};

	handleFocus = () => {
		this.setState({ inputNode: this.input });
	};

	handleInput = (event) => {
		this.setState({
			name: event.target.value,
		});
	};

	render() {
		const { inputNode } = this.state;
		// const {} = this.props;

		return (
			<div className="photo-booth-modal-form">
				<p>
					Supply the following if you would like us to email you the results of
					the match.
				</p>

				<p>
					<label>Name:</label>
					<input
						type="text"
						name="name"
						id="name"
						value={this.state.name}
						placeholder="Selfie Fiend"
						onChange={(event) => this.handleUserInput(event)}
						onInput={this.handleInput}
						onFocus={this.handleFocus}
						ref={(input) => {
							this.input = input;
						}}
					/>
				</p>

				<p>
					<label>Email:</label>
					<input
						type="email"
						name="email"
						id="email"
						value={this.state.email}
						placeholder="fiend@selfie-land.com"
						onChange={(event) => this.handleUserInput(event)}
					/>
					<span className="formErrors email">
						{this.state.formErrors.email}
					</span>
				</p>

				{process.browser && inputNode && <Keyboard inputNode={inputNode} />}

				<p>
					Please tell us a few things about yourself so we can match you to a
					portrait from our collection.
				</p>
				<p>
					<label>Your interests:</label>
					<input
						type="text"
						name="interests"
						id="interests"
						value={this.state.interests}
						placeholder="Enter around 4 or 5, separated by commas"
						onChange={(event) => this.handleUserInput(event)}
					/>
					<span className="formErrors interests">
						{this.state.formErrors.interests}
					</span>
				</p>

				<p>
					<button
						className="button"
						onClick={this.handleSubmitForm}
						disabled={this.state.formValid !== true || this.state.isFormSending}
					>
						Submit
					</button>
					<button
						className="button button--dark"
						onClick={this.handleQuitButton}
					>
						Quit
					</button>
				</p>
			</div>
		);
	}
}

export default PhotoBoothModalForm;
