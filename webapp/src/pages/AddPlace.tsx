import React, { ChangeEvent, Component } from "react";
import LeafletMapAdapter from "../adapters/map/LeafletMapAdapter";
import PlaceManager from "../adapters/solid/PlaceManager";
import Place from "../domain/Place";
import Placemark from "../domain/Placemark";
import '../styles/AddPlace.css'

// Define the state type.
interface IState {
	name: string;
	latitude: number;
	longitude: number;
	description: string;
	photosSelected: File[]; // The array of photos.
}

// Define the props type.
interface IProps{
	placemark: Placemark;
	callback?: Function;
}

export default class AddPlace extends React.Component<IProps, IState> {
	defName: string = "Name";
	defDescription: string = "Description.";


	// Define default values for the page. This would not be necessary when the page is indexed.
	public static defaultProps: IProps = {
		placemark: new Placemark(0.5, 0.2, "asdf")
	};

	public constructor(props: IProps) {
		super(props);

		// The state is the Place object that will be created and passed to the next function.
		// It is constructed by the props of the Placemark where the place is.
		this.state = {
			name: this.defName,
			latitude: this.props.placemark.getLat(),
			longitude: this.props.placemark.getLng(),
			description: this.defDescription,
			photosSelected: [],
		};

		// Binding the calls.
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handlePhotoChange = this.handlePhotoChange.bind(this);
		this.handleClearImage = this.handleClearImage.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// Fill in the state.
	// When a value is modified in the form (onChange function) the value of the state is updated.
	handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		} as unknown as Pick<IState, keyof IState>);
	}

	// Fill the array of photographies
	handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
		// Get the length of the files array.
		if (event.target.files != null){
			let filesLength = event.target.files.length;
			// Use a for loop to iterate through each file.
			for (let i = 0; i < filesLength; i++) {
				// Get the current file from the array.
				let photo = event.target.files[i];
				// Add each file to the state array using setState function with a callback argument.
				this.setState((prevState) => ({
					photosSelected: [...prevState.photosSelected, photo]
				}));

			}
		}
	}


	// Define a handler function that empties the state array.
	handleClearImage(){
		// Set the state array to an empty array using setState function.
		this.setState({ photosSelected: [] });
	}

	// Define a handler function that deletes a specific file from the state array.
	handleDeleteImage (fileName: string){
		// Remove the file with matching name from the state array using setState function with a callback argument and filter method.
		this.setState((prevState) => ({
			photosSelected: prevState.photosSelected.filter(
				(file) => file.name !== fileName
			)
		}));
	};

	// When the submit button is pressed, the parameters are validated and the object Place is created.
	// Here is where this object should be taken from to make it persistent.
	handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		//Validating parameters.
		if (!this.state.name) {
			alert("Name is required");
			return;
		}
		if (this.state.name === this.defName) {
			alert("Name cannot be '" + this.defName + "'");
			return;
		}
		if (!this.state.latitude || !this.state.longitude) {
			alert("Latitude and longitude are required");
			return;
		}
		if (isNaN(this.state.latitude) || isNaN(this.state.longitude)) {
			alert("Latitude and longitude must be numbers");
			return;
		}
		if (this.state.latitude < -90 || this.state.latitude > 90) {
			alert("Latitude must be between -90 and 90 degrees");
			return;
		}
		if (this.state.longitude < -180 || this.state.longitude > 180) {
			alert("Longitude must be between -180 and 180 degrees");
			return;
		}
		if (!this.state.description) {
			alert("Description is required");
			return;
		}
		if (this.state.description === this.defDescription) {
			alert("Description cannot be '" + this.defDescription + "'");
			return;
		}
		if (!this.state.photosSelected || this.state.photosSelected.length === 0) {
			alert("At least one photo is required");
			return;
		}

		// Handle form submission logic here.
		console.log("Form submitted:", this.state);

		var place = new Place(this.state.name, this.state.latitude, this.state.longitude, this.state.description, this.state.photosSelected);

		//Here has to be the rest of the logic for persitence on pods.
		//Here.
		//Here.

		(new PlaceManager()).createNewMapPoint(place);

		if (this.props.callback !== undefined) {
			this.props.callback(new Placemark(
				this.state.latitude, this.state.longitude, this.state.name
			));
			return <LeafletMapAdapter></LeafletMapAdapter>
		}
		//Here.
	}


	public render(): JSX.Element {
		return (
		<section className="Place-form">
			<h2>Fill the information of the new place.</h2>
			<form onSubmit={this.handleSubmit}>
			<div>
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					name="name"
					value={this.state.name}
					onChange={this.handleInputChange}
				/>
			</div>
			<div>
				<h3>Location:</h3> 
				<p>longitude ({this.state.longitude}) and latitude ({this.state.latitude}).</p>
			</div>
			<div>
				<label htmlFor="description">Description:</label>
				<textarea
					name="description"
					value={this.state.description}
					onChange={this.handleInputChange}
				/>
			</div>
			<div>
				<label htmlFor="photo">Photo:</label>
				<input type="file" name="photo" onChange={this.handlePhotoChange} />
			</div>
			<button type="submit">Submit</button>
			</form>
			{/* Display all uploaded photos using map function */}
			{this.state.photosSelected.map((file) => (
				<PhotoPreview key={file.name} file={file} onDelete={this.handleDeleteImage}/>
			))}

			{/* Use a button or a link element with onClick attribute */}
			<button onClick={this.handleClearImage}>Clear photos</button>
		</section>
		);
	}  
}

// Interface for the props of PhotoPreview component.
// onDelete is a function that will be called when the user clicks the "Delete photo" button to delete the photo.
// this function is passed as parameter by its parent and is the way to control it. That method from the parent is called
// inside this component so that the parent deletes the image that this component is using.
interface Props {
	file: File;
	onDelete: (fileName: string) => void;
}

//interface for the state of PhotoPreview component.
interface State {
	url: string;
	name: string;
}

// Component for displaying the images that were uploaded.
class PhotoPreview extends Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			url: "",
			name: ""
		};
		
		this.createUrl(this.props.file);
		// Binding the call.
		this.handleDelete = this.handleDelete.bind(this);
	}

	// Lifecycle method.
	// Method that is called when the component is mounted.
	componentDidMount() {
		this.createUrl(this.props.file);
	}

	// Lifecycle method.
	// Method that updates the component when the props of the component are updated.
	componentDidUpdate(prevProps: Props) {
		if (prevProps.file !== this.props.file) {
			this.createUrl(this.props.file);
		}
	}

	// Lifecycle method.
	// This method cleans up the created url when the component is no longer used.
	componentWillUnmount() {
		URL.revokeObjectURL(this.state.url);
	}

	// Creates a URL for the image and .
	createUrl(file: File){
		if (file != null) {
			const comUrl = URL.createObjectURL(file);
			this.setState({ url: comUrl });
			this.setState({ name: file.name});
		}
	};

	// This method is called inside the component to let the parent delete the image or handle the delete the way it wants.
	handleDelete(){
		this.props.onDelete(this.props.file.name);
	};

	render() {
		const { url, name } = this.state;
		return (
		<div className="photo-preview">
			<h2>Preview of {name}</h2>
			<img src={url} alt="Uploaded photo" />
			<button onClick={this.handleDelete}>Delete photo</button>
		</div>
		);
	}
}