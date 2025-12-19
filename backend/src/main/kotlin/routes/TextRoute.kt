package com.int531.routes

import com.int531.exceptions.IDCannotBeBlankException
import com.int531.exceptions.TextCannotBeBlankException
import com.int531.services.TextService
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
data class CreateMessage(val text: String)

@Serializable
data class UpdateMessage(val text: String)

fun Route.textRoutes(textService: TextService) {

    get("/texts") {
        call.respond(textService.getAllTexts())
    }

    post("/texts") {
        try {
            val body = call.receive<CreateMessage>()
            textService.createText(body.text)
            call.respond(HttpStatusCode.Created, "Text created")
        } catch (e: TextCannotBeBlankException) {
            call.respond(HttpStatusCode.BadRequest, e.message ?: "Invalid text")
        }
    }

    // PUT endpoint for creating new text (accepts plain text body)
    // This maintains backward compatibility with frontend
    put("/texts") {
        try {
            val text = call.receiveText()
            textService.createText(text)
            call.respond(HttpStatusCode.Created, "Text created")
        } catch (e: TextCannotBeBlankException) {
            call.respond(HttpStatusCode.BadRequest, e.message ?: "Invalid text")
        }
    }

    put("/texts/{id}") {
        try {
            val id = call.pathParameters["id"] ?: ""
            val body = call.receive<UpdateMessage>()

            textService.updateText(id, body.text)
            call.respond("Text updated")
        } catch (e: IDCannotBeBlankException) {
            call.respond(HttpStatusCode.BadRequest, e.message ?: "Invalid id")
        } catch (e: TextCannotBeBlankException) {
            call.respond(HttpStatusCode.BadRequest, e.message ?: "Invalid text")
        } catch (e: IllegalArgumentException) {
            call.respond(HttpStatusCode.BadRequest, "Invalid UUID format")
        }
    }

    delete("/texts/{id}") {
        try {
            val id = call.pathParameters["id"] ?: ""
            textService.deleteText(id)
            call.respond("Text deleted")
        } catch (e: IDCannotBeBlankException) {
            call.respond(HttpStatusCode.BadRequest, e.message ?: "Invalid id")
        } catch (e: IllegalArgumentException) {
            call.respond(HttpStatusCode.BadRequest, "Invalid UUID format")
        }
    }
}
