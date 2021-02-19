const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')
const { Card } = require('powercord/components')
const { Modal } = require('powercord/components/modal')
const { FormTitle, Text } = require('powercord/components')
const { close: closeModal } = require('powercord/modal')
const { Avatar } = getModule(['Avatar'], false)
const NotesHandler = new (require('../NotesHandler'))()

class noteDisplay extends React.PureComponent {
	constructor(props) {
		super(props)
	}


	async componentDidMount() {
	}

  render() {
	const settings = NotesHandler.getNotes()

	const noteArray = []
	const userId = []
	
	  /* First option: A for loop just pushes a ton of stuff to an array to display later, so it's basically just displaying the note in plain text (looks awful) */
	for(let i = 0; i < Object.keys(settings).length; i++) {
		let note = settings[Object.keys(settings)[i]]
		let msgs = note['Content']
		userId.push(note['User_ID'])
		noteArray.push(<Text selectable={true} style={{
			//'padding-left': '50px',
			'position': 'relative',
			'right': '8px',
			'padding-bottom': '10px',
			'padding-top': '10',
			'font-size': '15px'
		}}>{note['Message_ID']}</Text>)
		noteArray.push(<Avatar src={note['Avatar_URL']} size='SIZE_40'/>)
		noteArray.push(<span style={{
			'color' : 'white', 
			'position' : 'relative', 
			'paddingLeft': '10px',
			'marginTop': '23px',
			'bottom': '21px',
			'font-size': '20px'
		}}>{note['Username']}</span>)
		noteArray.push(<Text selectable={true} style={{
			'padding-left': '50px',
			'position': 'relative',
			'bottom': '15px',
			'padding-top': '10px',
			'font-size': '18px'
		}}>{note['Content']}</Text>)
		try {
			let attch = note['Attachment'] //Below is terrible, but it works for now
			if (attch.match(".png") || attch.match(".jpg") || attch.match(".gif") || attch.match(".jpeg")) {
				noteArray.push(<a href={note['Attachment']}> <img selectable={true} style={{
					'width': '70%',
					'height': 'auto',
					'padding-left': '50px',
					'padding-top': '5px',
					'padding-bottom': '15px',
					'position': 'relative',
					'display': 'inline'
				}} src={note['Attachment']} /> </a>)
			}
			if (attch.match(".mov") || attch.match(".webm") || attch.match(".mp4")) {
				noteArray.push(<video controls selectable={true} style={{
					'width': '70%',
					'height': 'auto',
					'padding-left': '50px',
					'padding-top': '5px',
					'padding-bottom': '15px',
					'position': 'relative',
					'display': 'inline'
				}} src={note['Attachment']} />)
			}
			if (attch.match(".mp3") || attch.match(".ogg") || attch.match(".wav")) {
				noteArray.push(<audio controls selectable={true} style={{
					'padding-left': '50px',
					'padding-top': '5px',
					'padding-bottom': '15px',
					'position': 'relative',
					'display': 'inline'
				}} src={note['Attachment']} />)
			}
		} catch {
		}
		noteArray.push(<br/>)
	}

	return(	
	  <Modal className='Notebook' size={Modal.Sizes.LARGE}>
		
		<Modal.Header>
        <FormTitle tag='h3'>Notebook</FormTitle>
        <Modal.CloseButton onClick={closeModal}/>
    	</Modal.Header>
		
		<Modal.Content>
			{noteArray}
			<Card className='smartTypers-preview'>
      			<fakeChannel/>
    		</Card>
    	</Modal.Content>
	  </Modal>
	)
  }
}

module.exports = noteDisplay;
