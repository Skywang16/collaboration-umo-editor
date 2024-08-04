import { Extension } from '@tiptap/core'

export default Extension.create({
  name: 'selection',
  addCommands() {
    return {
      getSelectionText:
        () =>
        ({ editor }) => {
          const { from, to, empty } = editor.state.selection
          if (empty) {
            return ''
          }
          return editor.state.doc.textBetween(from, to, '')
        },
      getSelectionNode:
        () =>
        ({ editor }) => {
          editor.commands.selectParentNode()
          return editor.state.selection.node
        },
      deleteSelectionNode:
        () =>
        ({ editor, chain }) => {
          const node = editor.commands.getSelectionNode()
          if (!node) {
            return
          }
          if (node.attrs.vueNode) {
            if (
              editor.isActive('image') ||
              editor.isActive('video') ||
              editor.isActive('audio') ||
              editor.isActive('file')
            ) {
              const { options } = useStore()
              const { id, src } = node
              options.value.onFileDelete(id, src)
            }
            chain().focus().deleteSelection().run()
            return
          }
          if (editor.isActive('table')) {
            chain().focus().deleteTable().run()
            return
          }
          editor.commands.deleteNode(node.type.name)
        },
    }
  },
})
