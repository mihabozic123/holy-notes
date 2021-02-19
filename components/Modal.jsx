const { React, getModule, getModuleByDisplayName, NavigationUtils } = require('powercord/webpack')
const { Card } = require('powercord/components')
const { Modal } = require('powercord/components/modal')
const { FormTitle, Text } = require('powercord/components')
const { close: closeModal } = require('powercord/modal')
const { match } = require('sucrase/dist/parser/tokenizer')
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
	console.log(settings)
	console.log(settings.length)
	console.log(Object.keys(settings).length)

	const noteArray = []
	const userId = []

	/* First option: A for loop just pushes a ton of stuff to an array to display later, so it's basically just displaying the note in plain text (looks awful) */
	for(let i = 0; i < Object.keys(settings).length; i++) {
		let note = settings[Object.keys(settings)[i]]
		userId.push(note['User ID'])
		noteArray.push(<Avatar src={note['Avatar URL']} size='SIZE_40' style={{
			'position': 'relative',
			'top': '20px'
		}} />)
		noteArray.push(<span style={{
			'color' : 'white', 
			'position' : 'relative', 
			'paddingLeft': '10px',
			'marginTop': '23px',
			'bottom': '21px',
			'font-size': '24px'
		}}>{note['Username']}</span>)
		noteArray.push(<a href={note['Message URL']}> <Text selectable={true} style={{
			'padding-left': '50px',
			'position': 'relative',
			'bottom': '8px',
			'font-size': '20px'
		}}>{note['Content']}</Text></a>)
		try {
			let attch = note['Attachment']
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
		} catch {
			console.log("Error in Attachment");
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
