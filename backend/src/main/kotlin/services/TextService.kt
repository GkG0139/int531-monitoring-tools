package com.int531.services

import com.int531.exceptions.IDCannotBeBlankException
import com.int531.exceptions.TextCannotBeBlankException
import com.int531.repositories.TextRepository
import java.util.UUID

class TextService(
    private val repository: TextRepository
) {
    suspend fun getAllTexts() = repository.getAllTexts()

    suspend fun createText(message: String) {
        if (message.isBlank()) {
            throw TextCannotBeBlankException("Text cannot be blank")
        }

        repository.create(message)
    }

    suspend fun updateText(id: String, text: String) {
        if (id.isBlank()) {
            throw IDCannotBeBlankException("ID cannot be blank")
        }

        if (text.isBlank()) {
            throw TextCannotBeBlankException("Text cannot be blank")
        }

        repository.update(UUID.fromString(id), text)
    }

    suspend fun deleteText(id: String) {
        if (id.isBlank()) {
            throw IDCannotBeBlankException("ID cannot be blank")
        }

        repository.delete(UUID.fromString(id))
    }
}