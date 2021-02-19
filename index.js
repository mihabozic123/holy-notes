const { Plugin } = require('powercord/entities');
const { Tooltip } = require('powercord/components');
const { inject, uninject } = require('powercord/injector');
const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const { open: openModal } = require('powercord/modal');
const { findInReactTree } = require('powercord/util');
const NotesHandler = new (require('./NotesHandler'))();

/* TODO: (cancelled due to recent events)
Inject into not only messagecontext but the 3 dot message menu as well
Create simulated channel and add messages
Replace the word "settings" with "notes" in Modal.jsx
*/

const NotebookButton = require('./components/NotebookButton');
const NoteButton = require('./components/NoteButton')
const Modal = require('./components/Modal');

module.exports = class Notebook extends Plugin {
  async startPlugin () {
    this._injectHeaderBarContainer()
    this._injectContextMenu()
    this._injectToolbar()

    powercord.api.commands.registerCommand({
        command: 'notebook',
        description: 'Notebook to keep your favourite notes',
        usage: '{c} [ args ]', //and now comes the horrifying mess. Heelp
        executor: (args) => {
            let n = args[1]
            console.log(n)
            let notes
            let note
            switch(args[0]){
                case 'erase':
                    let messageID
                    notes = NotesHandler.getNotes()
                    if(!n) {
                      return {
                        send: false,
                        result: 'Please input a number or valid ID'
                      }
                    } 

                    note = notes[n]
                    console.log(note)
                    messageID = note['Message_ID'] 
                    if(messageID === undefined) {
                        return {
                        send: false,
                        result: '```\nNot a note.\n```'
                        }
                    }
                    NotesHandler.deleteNote(messageID)
                    return {
                        send: false,
                        result: 'Note **'+n+'** deleted'
                    }
            }
            // i really should make functions to clean this horrifying mess up
        },
        autocomplete: (args) => {
			if (args.length !== 1) {
				return false;
			}
            let options = {
                erase: 'Erases Note from your Notebook given it\'s number.'
            }
			return {
				commands: Object.keys(options)
					.filter((option) => option.includes(args[0].toLowerCase()))
					.map((option) => ({
						command: option,
						description: options[option],
					})),
				header: 'Notebook commands',
			};
		}
    }) 
  }

  pluginWillUnload() {
    uninject('note-button');
    uninject('note-context-menu');
    powercord.api.commands.unregisterCommand('notebook')
  }

  async _injectHeaderBarContainer() {
    const classes = await getModule(['iconWrapper', 'clickable']);
    const HeaderBarContainer = await getModuleByDisplayName('HeaderBarContainer');
    inject('note-button', HeaderBarContainer.prototype, 'renderLoggedIn', (args, res) => {
      const Switcher = React.createElement(Tooltip, {
        text: 'Notebook',
        position: 'bottom'
      }, React.createElement('div', {
        className: ['note-button', classes.iconWrapper, classes.clickable].join(' ')
      }, React.createElement(NotebookButton, {
        className: ['note-button', classes.icon].join(' '),
        onClick: () =>
          openModal(() => React.createElement(Modal))
      })));
      if (!res.props.toolbar) {
        res.props.toolbar = Switcher;
      } else {
        res.props.toolbar.props.children.push(Switcher);
      }
      return res;
    });
  }

  async _injectContextMenu() {
    const Menu = await getModule(['MenuGroup', 'MenuItem'])
    const MessageContextMenu = await getModule(m => m.default && m.default.displayName == 'MessageContextMenu')
    inject('note-context-menu', MessageContextMenu, 'default', (args, res) => {
      if (!findInReactTree(res, c => c.props && c.props.id == 'notebook')) {
        res.props.children.splice(4, 0,
          React.createElement(Menu.MenuGroup, null, React.createElement(Menu.MenuItem, {
            action: () => this.saveMessage(args),
            id: 'notebook',
            label: 'Note Message'
          })
          ));
      }
      return res;
    });
    MessageContextMenu.default.displayName = 'MessageContextMenu'
  }
  
  async _injectToolbar() {
	const MiniPopover = await getModule((m) => m?.default?.displayName === "MiniPopover");
    inject("note-toolbar", MiniPopover, "default", (args, res) => {
		const props = findInReactTree(res, (r) => r?.message);
		const channel = findInReactTree(args, (r) => r?.channel);
		if (!props) return res;
		res.props.children.unshift(
			React.createElement(NoteButton, {
                message: props.message,
                channel: channel.channel
			})
		);
		return res;
	});
	MiniPopover.default.displayName = "MiniPopover";
  }
          
  saveMessage(args) {
    let attachments = args[0].message.attachments[0];
    let noteFormat = {
      'Message_ID': args[0].message.id,
      'Username':   args[0].message.author.username,
      'User_ID':    args[0].message.author.id,
      'Content':    args[0].message.content,
      'Timestamp':  args[0].message.timestamp,
      'Editstamp':  args[0].message.editedTimestamp,
      'Message_URL': `https://discord.com/channels/${args[0].channel.guild_id}/${args[0].channel.id}/${args[0].message.id}`,
      'Avatar_URL': `https://cdn.discordapp.com/avatars/${args[0].message.author.id}/${args[0].message.author.avatar}.png`
    }
    if (attachments) {
      noteFormat['Attachment'] = attachments.url;
    }
    NotesHandler.setNote(noteFormat);
  }
};
