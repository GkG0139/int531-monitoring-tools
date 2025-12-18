package com.int531.routes

import com.int531.services.TextService
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
        val texts = textService.getAllTexts()
        call.respond(texts)
    }

    post("/texts") {
        val body = call.receive<CreateMessage>()
        textService.createText(body.text)
        call.respond("Text created")
    }

    put("/texts/{id}") {
        val id = call.pathParameters["id"] ?: ""
        val body = call.receive<UpdateMessage>()
        textService.updateText(id, body.text)
        call.respond("Text updated")
    }

    delete("/texts/{id}") {
        val id = call.pathParameters["id"] ?: ""
        textService.deleteText(id)
        call.respond("Text deleted")
    }
}