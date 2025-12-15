package com.int531

import com.int531.plugins.configureAdministration
import com.int531.plugins.configureKoin
import com.int531.plugins.configureMonitoring
import com.int531.plugins.configureRouting
import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureMonitoring()
    configureDatabases()
    configureKoin()
    configureAdministration()
    configureRouting()
}
