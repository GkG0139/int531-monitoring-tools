package com.int531.repositories

import com.int531.tables.TextRecord
import com.int531.tables.TextTable
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.UUID

class TextRepository(
    private val dispatcherIO: CoroutineDispatcher = Dispatchers.IO
) {
    init {
        transaction {
            SchemaUtils.create(TextTable)
        }
    }

    suspend fun getAllTexts(): List<TextRecord> = withContext(dispatcherIO) {
        transaction {
            TextTable.selectAll()
                .toList()
                .map { it.toTextRecord() }
        }
    }

    suspend fun create(newMessage: String) = withContext(dispatcherIO) {
        transaction {
            TextTable.insert {
                it[message] = newMessage
            }
        }
    }

    suspend fun update(id: UUID, newMessage: String) = withContext(dispatcherIO) {
        transaction {
            TextTable.update({ TextTable.id eq id }) {
                it[message] = newMessage
            }
        }
    }

    suspend fun delete(id: UUID) = withContext(dispatcherIO) {
        transaction {
            TextTable.deleteWhere { TextTable.id eq id }
        }
    }

    private fun ResultRow.toTextRecord(): TextRecord {
        return TextRecord(
            id = this[TextTable.id].value.toString(),
            message = this[TextTable.message]
        )
    }
}