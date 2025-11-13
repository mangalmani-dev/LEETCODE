
import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body
        const userId = req.user.id
        const playlsit = await db.playlsit.create({
            data: {
                name,
                description,
                userId

            }
        })
        res.status(200).json({
            success: true,
            message: "Playlsit created successfully",
            playlsit
        })
    } catch (error) {
        console.error("Error in creating playlist:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create playlist",
        });
    }

}
export const getAllListDetails = async (req, res) => {

    try {
        const playlists = await db.playlists.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "playlist fetched succcessfully",
            playlists
        })
    } catch (error) {
        console.error("Error in fetching playlist:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch playlist"
        })
    }
}
export const getPlaylistDetails = async (req, res) => {
    const { playlistId } = req.params
    try {
        const playlist = await db.playlists.findUnique({
            where: {
                id: playlistId,
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })
        if (!playlist) {
            res.status(404).json({
                success: false,
                message: "playlist not exist"
            })
        }

        res.status(200).json({
            success: true,
            message: "playlist fetched succcessfully",
            playlist
        })


    } catch (error) {
        console.error("Error  in getting list details:", error);
        res.status(500).json({
            success: false,
            error: "Failed to get list detail playlist"
        })
    }
}

export const addProblemToPlaylist = async (req, res) => {
    const { playlistId } = req.params
    const { problemsId } = req.body
    try {
        if (!Array.isArray(problemsId) || problemsId.length === 0) {
            return res.status(404).json({ error: "invalid problem or measing" })
        }
        // create probelem

        const problemsInPlaylist = await db.problemsInPlaylist.createMany({
            data: problemsId.map((problemsId) => {
                playlistId,
                    problemsId,
                    problemsInPlaylist
            })
        })
        res.status(201).json({
            success: true,
            message: "problem added successfully"
        })


    } catch (error) {
        console.error("Error  in problem added:", error);
        res.status(500).json({
            success: false,
            error: "Failed to to add a problem"
        })
    }

}

export const deletePlaylist = async (req, res) => {

    const { playlistId } = req.params
    try {
        const deletedPlaylist = await db.playlist.delete({
            where: {
                id: playlistId
            }
        })
        res.status(200).json({
            message: "Playlist deleted successfully",
            success: true,
            deletePlaylist
        })

    } catch (error) {
        console.error("Error in deleteing the playlist:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete playist playlist"
        })
    }


}

export const removeProbelmFromPlaylist = async (req, res) => {

    const { playlist } = req.params
    const { problemsIds } = req.body

    try {
        if (!Array.isArray(problemsId) || problemsId.length === 0) {
            return res.status(404).json({ error: "invalid problem or measing" })
        }

        const deletedProblem = await db.problemsInPlaylist.deleteMany({
            where: {
                playlistId: {
                    problemsId: {
                        in: problemsIds
                    }
                }
            }
        })
        res.status(200).json({
            message: "Playlist problem deleted successfully",
            success: true,
            deletedProblem
        })
    } catch (error) {

        console.error("Error in deleteing the probelem:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete problem"
        })

    }



}

