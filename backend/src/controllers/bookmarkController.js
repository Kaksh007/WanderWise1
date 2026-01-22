import Bookmark from '../models/Bookmark.js'

export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.userId }).sort({
      createdAt: -1,
    })
    res.json(bookmarks)
  } catch (error) {
    next(error)
  }
}

export const addBookmark = async (req, res, next) => {
  try {
    const { destinationId, note, destinationName } = req.body

    if (!destinationId) {
      return res.status(400).json({ message: 'Destination ID is required' })
    }

    const bookmark = await Bookmark.create({
      userId: req.userId,
      destinationId,
      destinationName: destinationName || '',
      note: note || '',
    })

    res.status(201).json(bookmark)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bookmark already exists' })
    }
    next(error)
  }
}

export const removeBookmark = async (req, res, next) => {
  try {
    const { destinationId } = req.params

    const bookmark = await Bookmark.findOneAndDelete({
      userId: req.userId,
      destinationId,
    })

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' })
    }

    res.json({ message: 'Bookmark removed successfully' })
  } catch (error) {
    next(error)
  }
}

